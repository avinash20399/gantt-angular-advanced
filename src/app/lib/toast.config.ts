import { Toast } from '@bryntum/gantt';

// Custom toast styles
const toastStyles = `
    .b-toast {
        background-color: white !important;
        color: #333 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        padding: 12px 24px !important;
        font-size: 14px !important;
        border-left: 4px solid transparent !important;
    }

    .b-toast.b-toast-success {
        border-left-color: #4caf50 !important;
    }

    .b-toast.b-toast-error {
        border-left-color: #f44336 !important;
    }

    .b-toast.b-toast-warning {
        border-left-color: #ff9800 !important;
    }

    .b-toast.b-toast-info {
        border-left-color: #2196f3 !important;
    }

    /* Loading spinner styles */
    .b-mask {
        background-color: rgba(255, 255, 255, 0.8) !important;
    }

    .b-mask .b-mask-content {
        background-color: white !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        padding: 20px !important;
    }

    .b-load-spinner {
        border: 3px solid #f3f3f3 !important;
        border-top: 3px solid currentColor !important;
    }

    /* Success state spinner */
    .b-toast-success .b-load-spinner {
        border-top-color: #4caf50 !important;
    }

    /* Error state spinner */
    .b-toast-error .b-load-spinner {
        border-top-color: #f44336 !important;
    }

    /* Warning state spinner */
    .b-toast-warning .b-load-spinner {
        border-top-color: #ff9800 !important;
    }

    /* Info state spinner */
    .b-toast-info .b-load-spinner {
        border-top-color: #2196f3 !important;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Toast configuration object
export const toastConfig = {
    success: {
        cls: 'b-toast-success',
        timeout: 3000,
        side: 'top-end' as const,
    },
    error: {
        cls: 'b-toast-error',
        timeout: 5000,
        side: 'top-end' as const,
    },
    warning: {
        cls: 'b-toast-warning',
        timeout: 4000,
        side: 'top-end' as const,
    },
    info: {
        cls: 'b-toast-info',
        timeout: 3000,
        side: 'top-end' as const,
    },
};

// Helper function to show toasts
export const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
) => {
    Toast.show({
        html: message,
        ...toastConfig[type],
    });
};
