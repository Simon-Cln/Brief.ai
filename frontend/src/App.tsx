import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';

import Box from '@mui/joy/Box';
import CssBaseline from '@mui/joy/CssBaseline';
import Lottie from 'react-lottie';

import framesxTheme from './theme';
import Main from './blocks/Main';

import animationData from './anim.json';

export default function TeamExample() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <CssVarsProvider disableTransitionOnChange theme={framesxTheme}>

      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          position: 'relative',
          '& > div': {
            scrollSnapAlign: 'start',
          },
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: '1%',
            left: '-10%',
            width: '130%',
            height: '100%',
            zIndex: -1, 
          }}
        >
          <Lottie options={defaultOptions} />
        </Box>

        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0, 
            pointerEvents: 'none', 
            background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 1))',
          }}
        />

        <Main />
      </Box>
    </CssVarsProvider>
  );
}