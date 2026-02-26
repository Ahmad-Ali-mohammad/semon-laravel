import React from 'react';
import { render, screen } from '@testing-library/react';

function Dummy() {
  return <div>dummy content</div>;
}

describe('Dummy component', () => {
  it('renders text', () => {
    render(<Dummy />);
    expect(screen.getByText('dummy content')).toBeInTheDocument();
  });
});
