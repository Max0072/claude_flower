import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Букет роз',
  price: 1500,
  imageUrl: '/images/bouquet1.jpg',
  category: 'roses'
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ProductCard Component', () => {
  test('renders product information correctly', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        price={mockProduct.price}
        imageUrl={mockProduct.imageUrl}
        category={mockProduct.category}
      />
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.price} ₽`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toHaveAttribute('src', mockProduct.imageUrl);
    expect(screen.getByText('В корзину')).toBeInTheDocument();
    
    // Check if link is correct
    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', `/product/${mockProduct.id}`);
  });

  test('calls onAddToCart when add to cart button is clicked', () => {
    const mockAddToCart = jest.fn();
    
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        price={mockProduct.price}
        imageUrl={mockProduct.imageUrl}
        onAddToCart={mockAddToCart}
      />
    );

    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });

  test('renders without category when not provided', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        price={mockProduct.price}
        imageUrl={mockProduct.imageUrl}
      />
    );
    
    expect(screen.queryByText('roses')).not.toBeInTheDocument();
  });

  test('renders without crashing when onAddToCart is not provided', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        price={mockProduct.price}
        imageUrl={mockProduct.imageUrl}
      />
    );
    
    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);
    // Test passes if no error is thrown
  });
});