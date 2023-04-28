import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Home from './Home';

describe('Home component', () => {
  test('renders basic nav bar', () => {
    const { getByTestId } = render(<Home />);
    const navBar = getByTestId('basic-nav-bar');
    expect(navBar).toBeInTheDocument();
  });

  test('renders upper text container with heading and body text', () => {
    const { getByText } = render(<Home />);
    const heading = getByText('Audit & Feedback');
    const bodyText = getByText(/Thank you for your interest/);
    expect(heading).toBeInTheDocument();
    expect(bodyText).toBeInTheDocument();
  });

  test('renders SOSPD and CAPD buttons', () => {
    const { getByText } = render(<Home />);
    const sospdButton = getByText('SOSPD Audit Section');
    const capdButton = getByText('CAPD Audit Section');
    expect(sospdButton).toBeInTheDocument();
    expect(capdButton).toBeInTheDocument();
  });

  test('clicking on the SOSPD button redirects to the form page', () => {
    const { getByText } = render(<Home />);
    const sospdButton = getByText('SOSPD Audit Section');
    fireEvent.click(sospdButton);
    expect(window.location.href).toBe('/form');
  });

  test('clicking on the CAPD button redirects to the form page', () => {
    const { getByText } = render(<Home />);
    const capdButton = getByText('CAPD Audit Section');
    fireEvent.click(capdButton);
    expect(window.location.href).toBe('/form');
  });

  test('renders contact info', () => {
    const { getByTestId } = render(<Home />);
    const contactInfo = getByTestId('contact-info');
    expect(contactInfo).toBeInTheDocument();
  });
});
