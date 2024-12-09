export interface Product {
    _id: string, 
    name: string
    description: string,
    price: number,
    quantity: number,
    category: string,
    image: string,
    ingredients: string,
    factory: string,
    country: string,
    unit: string,
}

export interface User {
    id: string,
    username: string,
    email: string,
    phone: string,
    address: string
}

export interface Order {
    _id: string,
    customer: string,
    items: [{
        product: Product,
        quantity: number
    }],
    totalPrice: number,
    orderDate: Date,
    status: string
}

export interface Category {
    id: number,
    name: string,
    quantity: number,
    image: string
}
