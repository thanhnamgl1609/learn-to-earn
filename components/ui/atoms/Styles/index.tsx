import { FC, useMemo } from 'react';

type StyleProps = {
  className?: string;
  flex?: boolean;
  flexWrap?: boolean;
  center?: boolean;
  centerX?: boolean;
  centerY?: boolean;
  rightX?: boolean;
  gap?: string | number;
  gapX?: string | number;
  gapY?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
};

type WithStylesReturnType<T extends StyleProps = StyleProps> = (
  baseClass?: string
) => (Component: FC<T>) => FC<T>;

const STYLE_SHEETS = {
  center: ['items-center', 'justify-center'],
  centerX: ['justify-center'],
  centerY: ['items-center'],
  rightX: ['justify-end'],
  flexWrap: ['flex-wrap'],
};

const STYLESHEETS_WITH_VAL = {
  gap: 'gap-',
  gapX: 'gap-x-',
  gapY: 'gap-y-',
  margin: 'm-',
  marginTop: 'mt-',
  marginBottom: 'mb-',
};

const withStyles = <T,>(Component: FC<T>, baseClass?: string) => {
  return ({ className, ...componentProps }: T & StyleProps) => {
    const props = useMemo(() => {
      const { styles, childrenProps } = Object.keys(componentProps).reduce(
        (prev, key) =>
          key in STYLE_SHEETS || key in STYLESHEETS_WITH_VAL
            ? {
                ...prev,
                styles: { ...prev.styles, [key]: componentProps[key] },
              }
            : {
                ...prev,
                childrenProps: {
                  ...prev.childrenProps,
                  [key]: componentProps[key],
                },
              },
        { styles: {}, childrenProps: {} }
      );

      const classList = [baseClass, className].filter(Boolean);

      Object.entries(STYLE_SHEETS).forEach(([style, styleClass]) => {
        if (styles[style]) classList.push(...styleClass);
      });

      Object.entries(STYLESHEETS_WITH_VAL).forEach(([style, styleClass]) => {
        const weight = styles[style];
        if (weight) {
          const val = typeof weight === 'string' ? `[${weight}]` : weight;
          classList.push(`${styleClass}${val}`);
        }
      });

      return {
        ...childrenProps,
        className: [...new Set(classList)].join(' '),
      };
    }, [componentProps]) as T;

    return <Component {...props} />;
  };
};

export default withStyles;
