const bookOfStyles = {
    purchaseQuantity: [
        'w-[50px]',
        'text-center',
        'py-1',
        'px-2',
        'border',
        'border-grey-700',
        'border-2',
        'disabled:border-0',
        'rounded',
        'text-black',
        'font-bold',
        'disabled:text-gray-700',
        'focus:outline-none',
        'focus:shadow-outline',
        
    ],
    quantityElementsContainer: [
        'flex-auto',
        'justify-center',
    ],
    quantityButtons: [
        'w-[50px]',
        'h-[25px]',
        'bg-white',
        'm-4'
    ]
};

export function useStyle(type){
    if(typeof type === 'string') return bookOfStyles[type];
    else {
        const allStyles = type.map((t) => bookOfStyles[t]);
        return allStyles.flat();
    }
}