import React from 'react';
import { Link } from 'react-router-dom';

import styles from './mainPage.module.css';

const MainPage = () => {
  const hello = '';

  return (
    <>
      <div className={styles.navbar}>
        <Link to="/login">Login</Link>
      </div>
    </>
  );
};

export default MainPage;
