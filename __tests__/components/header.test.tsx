import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/header'; 
import { useProductListContext } from '@/context/ProductListContext';
import { useUserOrderContext } from '@/context/UserOrderContext';
import { useRouter, usePathname } from 'next/navigation';
import { Product, User } from '@/type';

jest.mock('@/context/ProductListContext', () => ({
  useProductListContext: jest.fn()
}));

jest.mock('@/context/UserOrderContext', () => ({
  useUserOrderContext: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

const mockUser: User = {
    username: 'testuser',
    id: '',
    email: '',
    phone: '',
    address: ''
};

const mockProducts: Product[] = [
  {
      _id: '1',
      name: 'Paracetamol',
      description: '',
      price: 0,
      quantity: 0,
      category: '',
      image: '',
      ingredients: '',
      factory: '',
      country: '',
      unit: ''
  },
  {
      _id: '2',
      name: 'Aspirin',
      description: '',
      price: 0,
      quantity: 0,
      category: '',
      image: '',
      ingredients: '',
      factory: '',
      country: '',
      unit: ''
  }
];

describe('Header Component', () => {
  beforeEach(() => {
    // Setup mocks
    (useProductListContext as jest.Mock).mockReturnValue({ 
      products: mockProducts 
    });
    (useUserOrderContext as jest.Mock).mockReturnValue({ 
      orders: [] 
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    });
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders header with user name', () => {
    render(<Header user={mockUser} />);
    
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Header user={mockUser} />);
    
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    expect(screen.getByText('Sản phẩm')).toBeInTheDocument();
  });

  it('performs search functionality', () => {
    render(<Header user={mockUser} />);
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm thuốc ...');
    
    fireEvent.change(searchInput, { target: { value: 'Paracetamol' } });
    
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
  });

  it('shows cart orders count', () => {
    (useUserOrderContext as jest.Mock).mockReturnValue({ 
      orders: [1, 2, 3]
    });

    render(<Header user={mockUser} />);
    
    const cartCount = screen.getByText('3');
    expect(cartCount).toBeInTheDocument();
  });
});