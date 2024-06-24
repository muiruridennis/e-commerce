import React from 'react';
import Link from 'next/link';
import { Category } from '../../../payload/payload-types';
import CategoryCard from './CategoryCard';
import classes from './index.module.scss';

const Categories = ({ categories }: { categories: Category[] }) => {
  // Function to shuffle an array
  const shuffleArray = (array: Category[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle categories and select the first 3
  const shuffledCategories = shuffleArray([...categories]).slice(0, 3);

  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Shop by Categories</h3>
        <Link href="/products">Show All</Link>
      </div>

      <div className={classes.list}>
        {shuffledCategories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

export default Categories;
