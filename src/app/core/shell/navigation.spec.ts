import { routes } from '../../app.routes';
import { findGroupIdByPath, NAV_GROUPS, NAV_ITEMS, TOPICS } from './navigation';

describe('NAV_GROUPS', () => {
  const items = NAV_GROUPS.flatMap((group) => group.items);

  it('should use unique ids for groups and items', () => {
    const ids = [...NAV_GROUPS.map((group) => group.id), ...items.map((item) => item.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should not define a path for upcoming topics', () => {
    for (const item of items.filter((entry) => entry.status === 'upcoming')) {
      expect('path' in item).toBe(false);
    }
  });

  it('should only enable topics that have a registered route', () => {
    const registeredPaths = routes.map((route) => `/${route.path}`.replace(/^\/\*\*$/, ''));

    for (const item of items) {
      if (item.status === 'available') {
        expect(registeredPaths).toContain(item.path);
      }
    }
  });

  it('should expose topics for Home without the Home item itself', () => {
    expect(NAV_ITEMS).toEqual(items);
    expect(TOPICS.map((topic) => topic.id)).toEqual(
      items.filter((item) => item.id !== 'home').map((item) => item.id),
    );
  });

  it('should find the group that owns an available path', () => {
    expect(findGroupIdByPath('/signals')).toBe('reactivity');
    expect(findGroupIdByPath('/')).toBe('start');
    expect(findGroupIdByPath('/unknown')).toBeUndefined();
  });
});
