'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface WidgetWompiProps {
  amount: number;
  isOpen: boolean;
  label: string;
  className?: string;
}

function WidgetWompi({ amount, isOpen, label, className }: WidgetWompiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const loadWompiWidget = async () => {
      try {
        const response = await fetch('/api/wompi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });
        const data = await response.json();
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

        const script = document.createElement('script');
        script.id = 'wompi-script';
        script.src = 'https://checkout.wompi.co/widget.js';
        script.setAttribute('data-render', 'button');
        script.setAttribute('data-public-key', data.publicKey);
        script.setAttribute('data-currency', data.currency);
        script.setAttribute('data-amount-in-cents', data.amountInCents);
        script.setAttribute('data-reference', data.reference);
        script.setAttribute('data-signature:integrity', data.hash);
        script.setAttribute('data-redirection-url', `${baseUrl}/customer/appointments`);


        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(script);
          
          // Aplicar estilos mejorados al botón de Wompi
          setTimeout(() => {
            const wompiButton = containerRef.current?.querySelector('button');
            if (wompiButton && buttonRef.current) {
              const styles = window.getComputedStyle(buttonRef.current);
              Object.assign(wompiButton.style, {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                border: styles.border,
                borderRadius: styles.borderRadius,
                padding: styles.padding,
                fontSize: '0.875rem', // text-sm
                fontFamily: styles.fontFamily,
                width: '100%',
                height: '40px', // h-10
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.25rem',
                fontWeight: '800',
                transition: 'all 0s',
              });
              wompiButton.textContent = label;
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error loading Wompi widget:', error);
      }
    };

    loadWompiWidget();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isOpen, amount, label]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full"></div>
      <Button
        ref={buttonRef}
        variant='default'
        className="hidden text-sm h-10 font-bold"
      >
        {label}
      </Button>
    </div>
  );
}

export default WidgetWompi;