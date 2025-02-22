import * as React from 'react';
import { Enter, Space } from '@fluentui/keyboard-keys';
import type { LinkState } from './Link.types';

/**
 * The useLinkState hook processes the Link state.
 * @param state - Link state to mutate.
 */
export const useLinkState = (state: LinkState): LinkState => {
  const { disabled, disabledFocusable } = state;
  const { onClick, onKeyDown, role, type } = state.root;

  // Add href and tabIndex=0 for anchor elements.
  if (state.root.as === 'a') {
    state.root.href = disabled ? undefined : state.root.href;
    state.root.tabIndex = disabled && !disabledFocusable ? undefined : 0;
  }
  // Add 'role=link' and 'type=button' for button elements.
  else {
    state.root.role = role || 'link';
    state.root.type = type || 'button';
  }

  // Disallow click event when component is disabled and eat events when disabledFocusable is set to true.
  state.root.onClick = (ev: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    if (disabled || disabledFocusable) {
      ev.preventDefault();
    } else {
      onClick?.(ev);
    }
  };

  // Disallow keydown event when component is disabled and eat events when disabledFocusable is set to true.
  state.root.onKeyDown = (ev: React.KeyboardEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    if ((disabled || disabledFocusable) && (ev.key === Enter || ev.key === Space)) {
      ev.preventDefault();
      ev.stopPropagation();
    } else {
      onKeyDown?.(ev);
    }
  };

  // Set the aria-disabled and disabled props correctly.
  state.root['aria-disabled'] = disabled || disabledFocusable;
  if (state.root.as === 'button') {
    state.root.disabled = disabled && !disabledFocusable;
  }

  return state;
};
