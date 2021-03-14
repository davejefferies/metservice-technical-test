import React from 'react';
import { render, screen } from '@testing-library/react';

import Dashboard from './Dashboard';

jest.mock('react-chartjs-2', () => ({
    Line: () => null,
}))
test('renders learn react link', () => {
    render(<Dashboard />);
});
