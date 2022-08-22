/**
 * Essa função filtra nomes duplicados em um array.
 * @param array array para filtrar.
 * @returns array filtrado.
 */

export const filterDuplicateNames = (array: string[]) =>
  array.filter((element, index) => array.indexOf(element) === index);
