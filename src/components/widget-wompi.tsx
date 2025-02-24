'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'


interface WidgetWompiProps {
  amount: number;
  isOpen: boolean;
  label: string;
  className?: string;
  paymentType: 'SUB' | 'SRV';  // Tipo de pago
  itemId: string;              // ID del item (subscripción o servicio)
  onClose: () => void;
}

function WidgetWompi({
  amount,
  isOpen,
  label,
  className,
  paymentType,
  itemId,
  onClose
}: WidgetWompiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession()

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const loadWompiWidget = async () => {
      try {

        const userId = session?.user?.id;

        const response = await fetch('/api/wompi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            paymentType,
            itemId,
            userId
          }),
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

          setTimeout(() => {
            const wompiButton = containerRef.current?.querySelector('button');
            if (wompiButton && buttonRef.current) {
              const styles = window.getComputedStyle(buttonRef.current);
              wompiButton.addEventListener('click', () => {
                setTimeout(onClose, 500);
              });
              Object.assign(wompiButton.style, {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                border: styles.border,
                borderRadius: styles.borderRadius,
                padding: styles.padding,
                fontSize: '0.875rem',
                fontFamily: styles.fontFamily,
                width: '100%',
                height: '40px',
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
  }, [isOpen, amount, label, paymentType, itemId, onClose]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full"></div>
      <Button ref={buttonRef} variant='default' className="hidden text-sm h-10 font-bold">
        {label}
      </Button>
    </div>
  );
}

export default WidgetWompi;