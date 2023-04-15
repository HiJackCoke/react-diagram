import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';

type ElementType = {
   [key: string]: () => JSX.Element;
};

const REQUIRED: Record<string, ElementType> = import.meta.globEager(
   '/src/pages/(404).tsx',
);
const ELEMENTS: Record<string, ElementType> = import.meta.globEager(
   '/src/pages/**/[a-z[]*.tsx',
);

const requires: ElementType = Object.keys(REQUIRED).reduce((require, file) => {
   const key = file.replace(/\/src\/pages\/|\.tsx$/g, '');
   return { ...require, [key]: REQUIRED[file].default };
}, {});

const elements = Object.keys(ELEMENTS).map((element) => {
   const path = element
      .replace(/\/src\/pages|index|\.tsx$/g, '')
      .replace(/\[\.{3}.+\]/, '*')
      .replace(/\[(.+)\]/, ':$1');

   return { path, element: ELEMENTS[element].default };
});

export function App() {
   // const Index = requires?.['index'] || Fragment;
   const NotFound = requires?.['404'] || Fragment;

   return (
      <Routes>
         {/* <Route path="/" element={<Index />} /> */}
         {elements.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
         ))}
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
}
