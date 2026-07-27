let resendInstance = null

function getResend() {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY
    if (!key) {
      console.warn('RESEND_API_KEY environment variable is not set — emails will not be sent')
      return null
    }
    const { Resend } = require('resend')
    resendInstance = new Resend(key)
  }
  return resendInstance
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'Zen Craft Bracelets <noreply@braceletstore.zen>'
const STORE_NAME = 'Zen Craft Bracelets'

/**
 * Build the HTML for an order confirmation email
 */
function buildOrderConfirmationHtml({ orderId, customerName, items, total, discount, shippingAddr, locale }) {
  const isZh = locale === 'zh'

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333;">
        <strong>${escapeHtml(item.name)}</strong> × ${item.quantity}
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const title = isZh ? '订单确认' : 'Order Confirmed'
  const greeting = isZh ? `${customerName}，您好！` : `Hello ${customerName},`
  const thanks = isZh
    ? '感谢您在禅意手作 Zen Craft Bracelets 购买！您的订单已确认并开始处理。'
    : 'Thank you for your purchase at Zen Craft Bracelets! Your order has been confirmed and is being processed.'
  const orderLabel = isZh ? '订单编号' : 'Order ID'
  const totalLabel = isZh ? '订单金额' : 'Order Total'
  const discountLabel = isZh ? '优惠' : 'Discount'
  const itemsLabel = isZh ? '商品明细' : 'Order Items'
  const shippingLabel = isZh ? '收货地址' : 'Shipping Address'
  const viewLabel = isZh ? '查看订单详情' : 'View Order Details'
  const footerText = isZh
    ? '如有任何问题，请随时回复此邮件联系我们。'
    : 'If you have any questions, feel free to reply to this email.'
  const teamText = isZh
    ? '— 禅意手作 Zen Craft Bracelets 团队'
    : '— The Zen Craft Bracelets Team'
  const shipNote = isZh
    ? '我们将在 1-3 个工作日内为您发货，您将收到包含物流单号的跟踪邮件。'
    : 'We will ship your order within 1-3 business days. You will receive a tracking email once shipped.'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f5f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f0;">
    <tr><td style="padding: 40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="margin: 0 auto; max-width: 560px;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 22px; font-weight: 400; letter-spacing: 2px;">
              禅意手作
            </h1>
            <p style="color: #fff; margin: 4px 0 0; font-size: 13px; opacity: 0.8;">Zen Craft Bracelets</p>
            <div style="border-top: 1px solid rgba(212, 175, 55, 0.3); margin: 16px 0 12px;"></div>
            <p style="color: #fff; margin: 0; font-size: 16px; font-weight: 600;">${title}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background: #fff; padding: 32px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 15px; margin: 0 0 16px;">${greeting}</p>
            <p style="color: #555; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">${thanks}</p>

            <!-- Order ID -->
            <table width="100%" cellpadding="10" cellspacing="0" style="background: #FAFAF5; border-radius: 6px; margin-bottom: 24px;">
              <tr>
                <td style="font-size: 13px; color: #888;">${orderLabel}</td>
                <td style="font-size: 14px; font-weight: 600; color: #8B0000; text-align: right;">#${orderId}</td>
              </tr>
            </table>

            <!-- Items -->
            <h2 style="font-size: 14px; color: #8B0000; margin: 0 0 8px; font-weight: 600;">${itemsLabel}</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 12px 0 0; color: #888; font-size: 13px;">${discountLabel}:</td>
                <td style="padding: 12px 0 0; text-align: right; color: #28a745; font-size: 13px;">-${discount > 0 ? '$' + discount.toFixed(2) : (isZh ? '无' : 'None')}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-top: 2px solid #333; font-size: 15px; font-weight: 700; color: #333;">${totalLabel}:</td>
                <td style="padding: 12px 0; border-top: 2px solid #333; text-align: right; font-size: 18px; font-weight: 700; color: #8B0000;">$${total.toFixed(2)}</td>
              </tr>
            </table>

            <!-- Shipping -->
            ${shippingAddr ? `
            <h2 style="font-size: 14px; color: #8B0000; margin: 0 0 8px; font-weight: 600;">${shippingLabel}</h2>
            <p style="color: #555; font-size: 13px; margin: 0 0 24px; line-height: 1.5;">${escapeHtml(shippingAddr)}</p>
            ` : ''}

            <!-- Ship Note -->
            <p style="color: #666; font-size: 13px; margin: 0 0 24px; font-style: italic;">${shipNote}</p>

            <!-- View Order Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align: center; padding: 8px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3457'}/order/${orderId}"
                     style="display: inline-block; padding: 12px 32px; background: #8B0000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px;">
                    ${viewLabel}
                  </a>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0 0 4px; line-height: 1.5;">${footerText}</p>
              <p style="color: #999; font-size: 12px; margin: 0;">${teamText}</p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Send an order confirmation email
 */
export async function sendOrderConfirmation({ orderId, customerEmail, customerName, items, total, discount, shippingAddr, locale }) {
  const resend = getResend()
  if (!resend) {
    console.log(`[Email] Would send order confirmation for #${orderId} to ${customerEmail} (no API key configured)`)
    return { sent: false, reason: 'no_api_key' }
  }

  const isZh = locale === 'zh'
  const subject = isZh
    ? `[禅意手作] 订单 #${orderId} 已确认 — 感谢您的购买！`
    : `[Zen Craft Bracelets] Order #${orderId} Confirmed — Thank You!`

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject,
      html: buildOrderConfirmationHtml({
        orderId,
        customerName,
        items,
        total,
        discount,
        shippingAddr,
        locale,
      }),
    })
    console.log(`[Email] Order confirmation sent for #${orderId} to ${customerEmail}`)
    return { sent: true }
  } catch (error) {
    console.error(`[Email] Failed to send order confirmation for #${orderId}:`, error.message)
    return { sent: false, reason: error.message }
  }
}

/**
 * Send a shipping notification email (for future use)
 */
export async function sendShippingNotification({ orderId, customerEmail, customerName, trackingNumber, carrier, locale }) {
  const resend = getResend()
  if (!resend) {
    console.log(`[Email] Would send shipping notification for #${orderId} to ${customerEmail} (no API key configured)`)
    return { sent: false, reason: 'no_api_key' }
  }

  const isZh = locale === 'zh'
  const subject = isZh
    ? `[禅意手作] 订单 #${orderId} 已发货！`
    : `[Zen Craft Bracelets] Order #${orderId} Has Been Shipped!`

  const title = isZh ? '包裹已发出！' : 'Your Package Is On Its Way!'
  const greeting = isZh ? `${customerName}，您好！` : `Hello ${customerName},`
  const body = isZh
    ? `您的订单 #${orderId} 已通过 ${carrier} 发出，物流单号为：${trackingNumber}。`
    : `Your order #${orderId} has been shipped via ${carrier}. Tracking number: ${trackingNumber}.`
  const viewLabel = isZh ? '查看订单详情' : 'View Order Details'
  const footerText = isZh
    ? '如有任何问题，请随时回复此邮件联系我们。'
    : 'If you have any questions, feel free to reply to this email.'
  const teamText = isZh
    ? '— 禅意手作 Zen Craft Bracelets 团队'
    : '— The Zen Craft Bracelets Team'

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f5f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f0;">
    <tr><td style="padding: 40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="margin: 0 auto; max-width: 560px;">
        <tr>
          <td style="background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 22px; font-weight: 400; letter-spacing: 2px;">禅意手作</h1>
            <p style="color: #fff; margin: 4px 0 0; font-size: 13px; opacity: 0.8;">Zen Craft Bracelets</p>
            <div style="border-top: 1px solid rgba(212, 175, 55, 0.3); margin: 16px 0 12px;"></div>
            <p style="color: #fff; margin: 0; font-size: 16px; font-weight: 600;">${title}</p>
          </td>
        </tr>
        <tr>
          <td style="background: #fff; padding: 32px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 15px; margin: 0 0 16px;">${greeting}</p>
            <p style="color: #555; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">${body}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align: center; padding: 8px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3457'}/order/${orderId}"
                     style="display: inline-block; padding: 12px 32px; background: #8B0000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px;">
                    ${viewLabel}
                  </a>
                </td>
              </tr>
            </table>
            <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">${footerText}</p>
              <p style="color: #999; font-size: 12px; margin: 4px 0 0;">${teamText}</p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
    console.log(`[Email] Shipping notification sent for #${orderId} to ${customerEmail}`)
    return { sent: true }
  } catch (error) {
    console.error(`[Email] Failed to send shipping notification for #${orderId}:`, error.message)
    return { sent: false, reason: error.message }
  }
}
