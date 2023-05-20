import { RouterTransition } from '../components/shell/RouterTransition';
import React, { FC, PropsWithChildren } from 'react';
import '../app.scss';

const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <RouterTransition />
        {children}
      </body>
    </html>
  );
};

export default App;
