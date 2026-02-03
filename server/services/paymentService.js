// Moyasar Payment Gateway Service
// Docs: https://moyasar.com/docs/api/

const MOYASAR_API_URL = 'https://api.moyasar.com/v1';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(process.env.MOYASAR_SECRET_KEY + ':').toString('base64')}`,
});

/**
 * Create a payment with Moyasar
 */
export const createMoyasarPayment = async ({ amount, method, cardDetails, description, metadata }) => {
  // If Moyasar is not configured, simulate
  if (!process.env.MOYASAR_SECRET_KEY) {
    console.log('⚠️ Using simulated payment (Moyasar not configured)');
    return simulatePayment({ amount, method, description, metadata });
  }

  const body = {
    amount: Math.round(amount * 100), // Convert SAR to halalas
    currency: 'SAR',
    description: description || 'أثر البداية - اختبار التقييم المهني',
    callback_url: `${process.env.CLIENT_URL}/payment/callback`,
    metadata,
    source: buildPaymentSource(method, cardDetails),
  };

  const response = await fetch(`${MOYASAR_API_URL}/payments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'فشل في إنشاء عملية الدفع');
  }

  return {
    gatewayId: data.id,
    status: mapMoyasarStatus(data.status),
    transactionUrl: data.source?.transaction_url,
    rawResponse: data,
  };
};

/**
 * Verify a payment status
 */
export const verifyMoyasarPayment = async (paymentId) => {
  if (!process.env.MOYASAR_SECRET_KEY) {
    return { status: 'paid', verified: true };
  }

  const response = await fetch(`${MOYASAR_API_URL}/payments/${paymentId}`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  return {
    status: mapMoyasarStatus(data.status),
    verified: data.status === 'paid',
    rawResponse: data,
  };
};

// Build payment source based on method
function buildPaymentSource(method, cardDetails) {
  switch (method) {
    case 'visa':
    case 'mada':
      return {
        type: 'creditcard',
        name: cardDetails.cardName,
        number: cardDetails.cardNumber,
        month: cardDetails.cardExpiry?.split('/')[0],
        year: '20' + cardDetails.cardExpiry?.split('/')[1],
        cvc: cardDetails.cardCvc,
      };
    case 'stcpay':
      return { type: 'stcpay' };
    case 'applepay':
      return { type: 'applepay' };
    default:
      throw new Error('طريقة دفع غير مدعومة');
  }
}

// Map Moyasar status to our status
function mapMoyasarStatus(status) {
  const map = {
    initiated: 'pending',
    paid: 'paid',
    failed: 'failed',
    authorized: 'pending',
    captured: 'paid',
    refunded: 'refunded',
    voided: 'failed',
  };
  return map[status] || 'pending';
}

// Simulate payment for development
function simulatePayment({ amount, method, description, metadata }) {
  const fakeId = 'sim_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  return {
    gatewayId: fakeId,
    status: 'paid',
    transactionUrl: null,
    rawResponse: {
      id: fakeId,
      status: 'paid',
      amount: amount * 100,
      currency: 'SAR',
      description,
      metadata,
      source: { type: method, company: method },
      created_at: new Date().toISOString(),
      simulated: true,
    },
  };
}
