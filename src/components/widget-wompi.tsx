import Script from 'next/script'

interface WidgetWompiProps {
  amount: number
}

async function encodeString (stringToEncode: string) {
  const encondedText = new TextEncoder().encode(stringToEncode)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

async function WidgetWompi ({ amount }: WidgetWompiProps) {
  const amountInCents = `${amount * 100}`
  const currency = 'COP'
  const integritySecret = process.env.WOMPI_INTEGRITY_KEY
  const reference = crypto.randomUUID()
  const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`

  const hash = await encodeString(concatenatedString)

  return (
    <div >
      <form className='flex w-full'>
        <Script
          id="wompi-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                  (function() {
                      var script = document.createElement('script');
                      script.src = "https://checkout.wompi.co/widget.js";
                      script.setAttribute("data-render", "button");
                      script.setAttribute("data-public-key", "${process.env.WOMPI_PUBLIC_TEST_KEY ?? ''}");
                      script.setAttribute("data-currency", "${currency}");
                      script.setAttribute("data-amount-in-cents", "${amountInCents}");
                      script.setAttribute("data-reference", "${reference}");
                      script.setAttribute("data-signature:integrity", "${hash}");
                      script.async = true;
                      document.body.appendChild(script);
                  })();
              `
          }}
      />
      </form>
    </div>
  )
}

export default WidgetWompi
