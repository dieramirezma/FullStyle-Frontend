'use client'

import { useState } from 'react'
import RegisterBusinessForm from './register-business-form'
import RegisterOwnerForm from './register-categories-form'

export default function MultiStepRegistrationForm () {
  const [currentStep, setCurrentStep] = useState<'business' | 'categories'>('business')
  const [businessId, setBusinessId] = useState<string | null>(null)

  const handleBusinessRegistered = (siteId: string) => {
    setBusinessId(siteId)
    setCurrentStep('categories')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {currentStep === 'business' && <RegisterBusinessForm className="w-full"
                urlCallback="/owner" onRegistrationComplete={handleBusinessRegistered} />}

      {currentStep === 'categories' && businessId && <RegisterOwnerForm urlCallback={'/owner'} siteId={businessId} />}
    </div>
  )
}
