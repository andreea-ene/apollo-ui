import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ExecutionStatusIcon, getExecutionStatusColor } from './ExecutionStatusIcon';

vi.mock('../../utils/icon-registry', () => ({
  CanvasIcon: ({ icon, color, size }: { icon: string; color?: string; size?: number }) => (
    <span data-color={color} data-icon={icon} data-size={size} data-testid="canvas-icon" />
  ),
}));

vi.mock('@uipath/apollo-wind', () => ({
  Spinner: ({
    className,
    style,
    label,
  }: {
    className?: string;
    style?: CSSProperties;
    label?: string;
  }) => <span className={className} data-label={label} data-testid="spinner" style={style} />,
}));

describe('ExecutionStatusIcon', () => {
  it('renders InProgress as a primary-colored spinner via getExecutionStatusColor', () => {
    render(<ExecutionStatusIcon status="InProgress" size={20} />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner.className).toContain('[&>svg]:text-[color:var(--spinner-color)]');
    expect(spinner.style.getPropertyValue('--spinner-color')).toBe(
      getExecutionStatusColor('InProgress')
    );
    expect(spinner).toHaveAttribute('data-label', 'In progress');
  });

  it.each([
    ['Cancelled', 'circle-stop'],
    ['UserCancelled', 'circle-slash'],
  ])('renders %s with the %s glyph and muted color', (status, glyph) => {
    render(<ExecutionStatusIcon status={status} size={20} />);

    const icon = screen.getByTestId('canvas-icon');
    expect(icon).toHaveAttribute('data-icon', glyph);
    expect(icon).toHaveAttribute('data-color', 'var(--color-foreground-muted)');
    expect(icon).toHaveAttribute('data-size', '20');
  });

  it('renders EarlyExit with the early exit glyph and success color', () => {
    render(<ExecutionStatusIcon status="EarlyExit" size={20} />);

    const icon = screen.getByTestId('early-exit-status-icon');
    expect(icon).toBeInTheDocument();
  });
});

describe('getExecutionStatusColor', () => {
  it('maps both cancel variants to the muted color, not an error or info color', () => {
    expect(getExecutionStatusColor('Cancelled')).toBe('var(--color-foreground-muted)');
    expect(getExecutionStatusColor('UserCancelled')).toBe('var(--color-foreground-muted)');
  });

  it('maps InProgress to the primary color', () => {
    expect(getExecutionStatusColor('InProgress')).toBe('var(--color-primary)');
  });
});
