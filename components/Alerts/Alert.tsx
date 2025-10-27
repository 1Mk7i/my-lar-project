'use client'

import React, { useEffect, useState } from 'react'
import styles from '@/components/Alerts/Alert.module.css'

export type Variant = "danger" | "success" | "information" | "warning";

export interface Alert {
  title: string
  type: Variant
}

interface AlertMessageProps {
  alert: Alert
  onClose?: () => void
}

const AlertMessage: React.FC<AlertMessageProps> = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    const timer = setTimeout(() => {
      handleClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const getVariantClass = (variant: Variant) => {
    switch (variant) {
      case "danger": return styles.alertDanger
      case "success": return styles.alertSuccess
      case "information": return styles.alertInformation
      case "warning": return styles.alertWarning
      default: return ''
    }
  }

  const getAlertIcon = (type: Variant) => {
    switch (type) {
      case "danger": return "❌"
      case "success": return "✅"
      case "information": return "ℹ️"
      case "warning": return "⚠️"
      default: return ""
    }
  }

  return (
    <div className={`${styles.alert} ${getVariantClass(alert.type)} ${isVisible ? styles.show : styles.hide}`}>
      <div className={styles.alertContent}>
        <span className={styles.alertIcon}>{getAlertIcon(alert.type)}</span>
        <div className={styles.alertText}>
          <strong>{alert.title}</strong>
        </div>
      </div>
      <button 
        className={styles.closebtn}
        onClick={handleClose}
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  )
}

export default AlertMessage