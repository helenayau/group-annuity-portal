import { NavGroup } from '@/types';

/**
 * Navigation configuration for the annuity user portal.
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 */
export const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      {
        title: 'Overview',
        url: '/',
        icon: 'piggyBank',
        isActive: false,
        shortcut: ['o', 'o'],
        items: []
      },
      {
        title: 'Index Strategies',
        url: '/strategies',
        icon: 'trendingUp',
        shortcut: ['s', 's'],
        items: []
      },
      {
        title: 'Income & Withdrawals',
        url: '/income',
        icon: 'billing',
        shortcut: ['i', 'i'],
        items: []
      },
      {
        title: 'Beneficiaries',
        url: '/beneficiaries',
        icon: 'teams',
        shortcut: ['b', 'b'],
        items: []
      },
      {
        title: 'Documents',
        url: '/documents',
        icon: 'post',
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Profile',
        url: '/profile',
        icon: 'profile',
        shortcut: ['m', 'm'],
        items: []
      },
      {
        title: 'Notifications',
        url: '/notifications',
        icon: 'notification',
        shortcut: ['n', 'n'],
        items: []
      }
    ]
  }
];
