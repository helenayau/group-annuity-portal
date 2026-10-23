'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

export const layoutOptions = [
  {
    value: 'cards',
    label: 'Cards',
    summary: 'Key figure up front, related actions grouped beside it.'
  },
  {
    value: 'list',
    label: 'List',
    summary: 'Settings-style rows: copy on the left, actions on the right.'
  },
  {
    value: 'tasks',
    label: 'Task list',
    summary: 'Mobile-first single column with large, tappable action rows.'
  }
] as const;

export type LayoutOption = (typeof layoutOptions)[number]['value'];

const parser = parseAsStringLiteral(layoutOptions.map((option) => option.value)).withDefault(
  'cards'
);

export function useLayoutOption() {
  return useQueryState('layout', parser);
}

// Keeps the chosen layout when moving between tabs.
export function withLayout(href: string, layout: LayoutOption) {
  return layout === 'cards' ? href : `${href}?layout=${layout}`;
}
