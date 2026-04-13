import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

/** Root ref so any screen can open Login / global routes reliably (nested stacks cannot always reach root). */
export const navigationRef = createNavigationContainerRef();

export function navigateRoot(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function navigateToCategories({ categoryId, categoryName } = {}) {
  if (!navigationRef.isReady()) return;
  const catId = categoryId != null ? String(categoryId) : null;
  const catName = categoryName != null ? String(categoryName) : '';

  navigationRef.dispatch(
    CommonActions.navigate({
      name: 'UserRoot',
      params: {
        screen: 'MainTabs',
        params: {
          screen: 'CategoriesTab',
          params: {
            screen: 'Categories',
            params: { categoryId: catId, categoryName: catName },
          },
        },
      },
    })
  );
}
