// app/globals.css.d.ts
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}