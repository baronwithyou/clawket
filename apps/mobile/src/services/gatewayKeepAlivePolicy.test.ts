import { shouldRunGatewayKeepAlive, BACKGROUND_KEEPALIVE_WINDOW_MS } from './gatewayKeepAlivePolicy';

describe('shouldRunGatewayKeepAlive', () => {
  it('runs only when app is active and transport is ready', () => {
    expect(shouldRunGatewayKeepAlive('ready', 'active')).toBe(true);
    expect(shouldRunGatewayKeepAlive('connecting', 'active')).toBe(false);
    expect(shouldRunGatewayKeepAlive('reconnecting', 'active')).toBe(false);
    expect(shouldRunGatewayKeepAlive('challenging', 'active')).toBe(false);
    expect(shouldRunGatewayKeepAlive('pairing_pending', 'active')).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'inactive')).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'background')).toBe(false);
  });

  it('runs on Android background within 5-minute window after last run start', () => {
    const now = Date.now();
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'android', now - 60_000)).toBe(true);
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'android', now - BACKGROUND_KEEPALIVE_WINDOW_MS + 1)).toBe(true);
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'android', now - BACKGROUND_KEEPALIVE_WINDOW_MS)).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'android', now - 6 * 60_000)).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'android', undefined)).toBe(false);
    expect(shouldRunGatewayKeepAlive('connecting', 'background', 'android', now)).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'inactive', 'android', now)).toBe(false);
    expect(shouldRunGatewayKeepAlive('ready', 'background', 'ios', now)).toBe(false);
  });
});
