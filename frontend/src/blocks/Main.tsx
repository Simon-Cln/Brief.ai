import Typography from '@mui/joy/Typography';
import MuiTypography from '@mui/material/Typography'; 
import Box from '@mui/joy/Box';
import { useDropzone } from 'react-dropzone';
import LinearProgress from '@mui/material/LinearProgress';
import TimerIcon from '@mui/icons-material/Timer';
import CompressIcon from '@mui/icons-material/Compress';
import DescriptionIcon from '@mui/icons-material/Description';
import ShortTextIcon from '@mui/icons-material/ShortText';
import './Main.css';
import anime from 'animejs';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Timer, Minimize2, FileText, AlignLeft, Download } from 'lucide-react';

interface Stats {
  originalLength: number;
  summaryLength: number;
  compression: string;
  generationTime: string;
}

export default function HeroLeft07() {
  const [summary, setSummary] = React.useState('');
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [eta, setEta] = React.useState<number | null>(null);
  const [showText, setShowText] = React.useState(false);
  const startTimeRef = React.useRef<number>(0);
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null); 

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) =>
      ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );

    if (validFiles.length > 0) {
      const selectedFile = validFiles[0];
      setFileName(selectedFile.name);
      setShowText(false);

      const formData = new FormData();
      formData.append('file', selectedFile);

      setIsLoading(true);
      setProgress(0);
      startTimeRef.current = Date.now();

      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Temps réel calculé
          const elapsedTime = Math.ceil((Date.now() - startTimeRef.current) / 1000);
          console.log(`Résumé reçu après ${elapsedTime} secondes`);
      
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
      
          setProgress(100);
          setIsLoading(false);
          setSummary(data.summary);
          setStats({
            originalLength: data.original_length,
            summaryLength: data.summary_length,
            compression: data.compression,
            generationTime: `${elapsedTime}s`, // Mise à jour avec le temps réel
          });
          setEta(0);
          setShowText(true);
        })
        .catch((error) => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          setIsLoading(false);
          setEta(null);
          console.error('Erreur lors du téléchargement:', error);
        });
      
      const estimatedTime = 119; 
      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Math.ceil((Date.now() - startTimeRef.current) / 1000);
        const remainingTime = Math.max(estimatedTime - elapsedTime, 0);

        const adjustedEta = remainingTime > 10
          ? remainingTime + Math.floor(Math.random() * 5 - 2) // Fluctuation si ETA > 10
          : remainingTime;

        setProgress(Math.min((elapsedTime / estimatedTime) * 100, 99));
        setEta(Math.max(adjustedEta, 0));

        if (adjustedEta <= 0 && progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }, 1000);
    }
  }, []);

  React.useEffect(() => {
    if (!fileName) {
      setShowText(false);
    }
  }, [fileName]);

  React.useEffect(() => {
    console.log('showText:', showText);
    console.log('Résumé actuel:', summary);
  }, [showText, summary]);

  React.useEffect(() => {
    if (showText) {
      const elapsedTime = Math.ceil((Date.now() - startTimeRef.current) / 1000);
      console.log(`Texte affiché après ${elapsedTime.toFixed(2)} secondes`);
    }
  }, [showText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.txt';
    link.click();
  };

  React.useEffect(() => {
    if (showText) {
      // Animation pour la zone d'upload qui monte
      anime({
        targets: '.dropzone',
        translateY: '-50%',
        duration: 1000,
        easing: 'easeInOutQuad',
        update: function(anim) {
          // Maintenir le centrage horizontal pendant l'animation
          const dropzone = document.querySelector('.dropzone') as HTMLElement;
          if (dropzone) {
            dropzone.style.transform = 
              `translateX(-50%) translateY(${anim.animations[0].currentValue}px)`;
          }
        }
      });

      // Animation pour faire disparaître le texte de présentation
      anime({
        targets: '.presentation-text',
        translateY: 50,
        opacity: 0,
        duration: 800,
        easing: 'easeInOutQuad'
      });
    } else {
      // Réinitialiser les animations
      anime({
        targets: '.dropzone',
        translateY: 0,
        duration: 500,
        easing: 'easeInOutQuad',
        update: function(anim) {
          // Maintenir le centrage horizontal pendant l'animation de retour
          const dropzone = document.querySelector('.dropzone') as HTMLElement;
          if (dropzone) {
            dropzone.style.transform = 
              `translateX(-50%) translateY(${anim.animations[0].currentValue}px)`;
          }
        }
      });

      anime({
        targets: '.presentation-text',
        translateY: 0,
        opacity: 1,
        duration: 500,
        easing: 'easeInOutQuad'
      });
    }
  }, [showText]);

  useEffect(() => {
    // Animation d'écriture pour le texte
    anime({
      targets: '.typing-text .letter',
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 50,
      delay: (el, i) => 50 * (i + 1)
    });
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="letter">
        {char}
      </span>
    ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
        mt: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box className="presentation-text" sx={{ 
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.5s ease'
      }}>
      <Typography
        level="h1"
        className="typing-text"
        sx={{
          fontWeight: 900,
          fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)',
          fontFamily: 'PolySans Median, sans-serif',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'black',
          textAlign: 'center',
          maxWidth: '600px',
          mt: 17,
        }}
      >
        {splitText('Réorganisez vos')}
        <br />
        {splitText('notes avec une')}
        <br />
        {splitText('IA intelligente')}
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            verticalAlign: 'middle',
            ml: 1, // Marge à gauche pour espacer le logo du texte
            width: '50px', // Agrandir légèrement le logo
            height: '50px',
            '& svg': {
              width: '100%',
              height: '100%',
              animation: 'fadeIn 4s ease-in-out',
            },
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
        >
          <svg
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.8605 11.4312L18.0779 11.5399C18.9565 11.9928 19.6721 12.7083 20.125 13.587L20.2337 13.8043C20.6685 14.6649 21.9003 14.6649 22.3442 13.8043L22.4529 13.587C22.9058 12.7083 23.6214 11.9928 24.5 11.5399L24.7174 11.4312C25.5779 10.9964 25.5779 9.76449 24.7174 9.32065L24.5 9.21196C23.6214 8.75906 22.9058 8.04348 22.4529 7.16486L22.3442 6.94747C21.9094 6.08696 20.6775 6.08696 20.2337 6.94747L20.125 7.16486C19.6721 8.04348 18.9565 8.75906 18.0779 9.21196L17.8605 9.32065C17 9.75544 17 10.9873 17.8605 11.4312Z"
              fill="black"
            />
            <path
              d="M19.5724 19.9185C20.4601 19.4656 20.4601 18.2065 19.5724 17.7536L18.25 17.0743C17.0724 16.4674 16.1123 15.5072 15.5054 14.3297L14.8261 13.0072C14.3732 12.1196 13.1141 12.1196 12.6612 13.0072L11.9819 14.3297C11.375 15.5072 10.4148 16.4674 9.23729 17.0743L7.91483 17.7536C7.02715 18.2065 7.02715 19.4656 7.91483 19.9185L9.23729 20.5978C10.4148 21.2047 11.375 22.1649 11.9819 23.3424L12.6612 24.6649C13.1141 25.5525 14.3732 25.5525 14.8261 24.6649L15.5054 23.3424C16.1123 22.1649 17.0724 21.2047 18.25 20.5978L19.5724 19.9185Z"
              fill="black"
            />
            <path
              d="M36.5652 25.3351L35.2246 24.6467C33.6032 23.8225 32.3079 22.5272 31.4837 20.9058L30.7953 19.5652C30.1884 18.3696 28.9746 17.6268 27.634 17.6268C26.2935 17.6268 25.0797 18.3696 24.4728 19.5652L23.7844 20.9058C22.9601 22.5272 21.6648 23.8225 20.0435 24.6467L18.7029 25.3351C17.5072 25.942 16.7645 27.1558 16.7645 28.4964C16.7645 29.837 17.5072 31.0507 18.7029 31.6576L20.0435 32.346C21.6648 33.1703 22.9601 34.4656 23.7844 36.087L24.4728 37.4275C25.0797 38.6232 26.2935 39.3659 27.634 39.3659C28.9746 39.3659 30.1884 38.6232 30.7953 37.4275L31.4837 36.087C32.3079 34.4656 33.6032 33.1703 35.2246 32.346L36.5652 31.6576C37.7608 31.0507 38.5036 29.837 38.5036 28.4964C38.5036 27.1558 37.7608 25.942 36.5652 25.3351ZM35.3333 29.2391L33.9927 29.9275C31.855 31.0145 30.1521 32.7174 29.0652 34.8551L28.3768 36.1957C28.1685 36.6033 27.788 36.6486 27.634 36.6486C27.48 36.6486 27.0996 36.6033 26.8913 36.1957L26.2029 34.8551C25.1159 32.7174 23.413 31.0145 21.2753 29.9275L19.9348 29.2391C19.5271 29.0308 19.4819 28.6504 19.4819 28.4964C19.4819 28.3424 19.5271 27.962 19.9348 27.7536L21.2753 27.0652C23.413 25.9783 25.1159 24.2754 26.2029 22.1377L26.8913 20.7971C27.0996 20.3895 27.48 20.3442 27.634 20.3442C27.788 20.3442 28.1685 20.3895 28.3768 20.7971L29.0652 22.1377C30.1521 24.2754 31.855 25.9783 33.9927 27.0652L35.3333 27.7536C35.7409 27.962 35.7862 28.3424 35.7862 28.4964C35.7862 28.6504 35.7409 29.0308 35.3333 29.2391Z"
              fill="black"
            />
          </svg>
        </Box>
      </Typography>
  
      <Typography
        textColor="text.secondary"
        sx={{
          fontSize: 'lg',
          lineHeight: 'lg',
          fontFamily: 'inherit',
          textAlign: 'justify',
          mt: 1,
          maxWidth: '600px',
          marginLeft:'10%',
        }}
      >
        Réduisez la complexité de vos cours ou<br />
        documents en résumés visuels clairs.
      </Typography>
      </Box>
  
      {/* Conteneur de la zone d'upload avec position relative */}
      <Box
        sx={{
          mt: 3,
          width: '100%',
          maxWidth: '600px',
          height: '400px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Zone d'upload */}
        <Box
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'drag-active' : ''} ${fileName ? 'file-dropped expanded' : ''}`}
          sx={{
            p: 4,
            border: '2px dashed',
            borderRadius: '8px',
            borderColor: fileName ? 'limegreen' : isDragActive ? 'primary.main' : 'neutral.300',
            textAlign: 'center',
            backgroundColor: fileName ? '#d4fcd3' : isDragActive ? 'primary.light' : 'neutral.100',
            cursor: 'pointer',
            transition: 'all 0.5s ease',
            position: 'absolute',
            top: 0,
            left: '17%',
            width: showText ? '100%' : '400px',
            height: showText ? '100%' : 'auto',
            maxHeight: '100%',
            overflow: 'auto',
          }}
        >
          <input {...getInputProps()} />
  
          {showText ? (
  <React.Fragment>
    <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
    width: '100%',
  }}
>
  <Typography
    sx={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'left',
    }}
  >
    L'IA a généré ceci
  </Typography>

  <Box
    sx={{
      width: '45px',
      height: '45px',
      ml: -16, // Marge à gauche pour espacer le logo du texte
      '& svg': {
        width: '100%',
        height: '100%',
        animation: 'shine 2s infinite alternate',
      },
      '@keyframes shine': {
      '0%': {
        fill: '#000000', // Noir
      },
      '50%': {
        fill: '#eeeeee', 
      },
      '100%': {
        fill: '#000000',
      },
    },
    }}
  >
    <svg
      width="45"
      height="45"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8605 11.4312L18.0779 11.5399C18.9565 11.9928 19.6721 12.7083 20.125 13.587L20.2337 13.8043C20.6685 14.6649 21.9003 14.6649 22.3442 13.8043L22.4529 13.587C22.9058 12.7083 23.6214 11.9928 24.5 11.5399L24.7174 11.4312C25.5779 10.9964 25.5779 9.76449 24.7174 9.32065L24.5 9.21196C23.6214 8.75906 22.9058 8.04348 22.4529 7.16486L22.3442 6.94747C21.9094 6.08696 20.6775 6.08696 20.2337 6.94747L20.125 7.16486C19.6721 8.04348 18.9565 8.75906 18.0779 9.21196L17.8605 9.32065C17 9.75544 17 10.9873 17.8605 11.4312Z"
      />
      <path
        d="M19.5724 19.9185C20.4601 19.4656 20.4601 18.2065 19.5724 17.7536L18.25 17.0743C17.0724 16.4674 16.1123 15.5072 15.5054 14.3297L14.8261 13.0072C14.3732 12.1196 13.1141 12.1196 12.6612 13.0072L11.9819 14.3297C11.375 15.5072 10.4148 16.4674 9.23729 17.0743L7.91483 17.7536C7.02715 18.2065 7.02715 19.4656 7.91483 19.9185L9.23729 20.5978C10.4148 21.2047 11.375 22.1649 11.9819 23.3424L12.6612 24.6649C13.1141 25.5525 14.3732 25.5525 14.8261 24.6649L15.5054 23.3424C16.1123 22.1649 17.0724 21.2047 18.25 20.5978L19.5724 19.9185Z"
      />
      <path
        d="M36.5652 25.3351L35.2246 24.6467C33.6032 23.8225 32.3079 22.5272 31.4837 20.9058L30.7953 19.5652C30.1884 18.3696 28.9746 17.6268 27.634 17.6268C26.2935 17.6268 25.0797 18.3696 24.4728 19.5652L23.7844 20.9058C22.9601 22.5272 21.6648 23.8225 20.0435 24.6467L18.7029 25.3351C17.5072 25.942 16.7645 27.1558 16.7645 28.4964C16.7645 29.837 17.5072 31.0507 18.7029 31.6576L20.0435 32.346C21.6648 33.1703 22.9601 34.4656 23.7844 36.087L24.4728 37.4275C25.0797 38.6232 26.2935 39.3659 27.634 39.3659C28.9746 39.3659 30.1884 38.6232 30.7953 37.4275L31.4837 36.087C32.3079 34.4656 33.6032 33.1703 35.2246 32.346L36.5652 31.6576C37.7608 31.0507 38.5036 29.837 38.5036 28.4964C38.5036 27.1558 37.7608 25.942 36.5652 25.3351ZM35.3333 29.2391L33.9927 29.9275C31.855 31.0145 30.1521 32.7174 29.0652 34.8551L28.3768 36.1957C28.1685 36.6033 27.788 36.6486 27.634 36.6486C27.48 36.6486 27.0996 36.6033 26.8913 36.1957L26.2029 34.8551C25.1159 32.7174 23.413 31.0145 21.2753 29.9275L19.9348 29.2391C19.5271 29.0308 19.4819 28.6504 19.4819 28.4964C19.4819 28.3424 19.5271 27.962 19.9348 27.7536L21.2753 27.0652C23.413 25.9783 25.1159 24.2754 26.2029 22.1377L26.8913 20.7971C27.0996 20.3895 27.48 20.3442 27.634 20.3442C27.788 20.3442 28.1685 20.3895 28.3768 20.7971L29.0652 22.1377C30.1521 24.2754 31.855 25.9783 33.9927 27.0652L35.3333 27.7536C35.7409 27.962 35.7862 28.3424 35.7862 28.4964C35.7862 28.6504 35.7409 29.0308 35.3333 29.2391Z"
      />
    </svg>
  </Box>

      {/* Deux premières statistiques côte à côte à droite */}
      {stats && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerIcon sx={{ color: 'primary.main', mr: 1 }} />
            <MuiTypography variant="body2" color="text.secondary">
              {stats.generationTime}
            </MuiTypography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CompressIcon sx={{ color: 'primary.main', mr: 1 }} />
            <MuiTypography variant="body2" color="text.secondary">
              {stats.compression}
            </MuiTypography>
          </Box>
        </Box>
      )}
    </Box>

    {/* Deux autres statistiques et texte du résumé en dessous */}
    <Box sx={{ textAlign: 'left', fontSize: '0.9rem', color: 'text.secondary', mb: 2 }}>
      {stats && (
        <React.Fragment>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DescriptionIcon sx={{ color: 'primary.main', mr: 1 }} />
            <MuiTypography variant="body2" color="text.secondary">
              {stats.originalLength} caractères
            </MuiTypography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShortTextIcon sx={{ color: 'primary.main', mr: 1 }} />
            <MuiTypography variant="body2" color="text.secondary">
              {stats.summaryLength} caractères
            </MuiTypography>
          </Box>

          {/* Logo de téléchargement avec texte interactif */}
          <Box
            onClick={downloadSummary}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              mb: 2,
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.25 8.99994C20.3077 9.07354 22.0549 10.6168 21.9987 12.6843C21.9856 13.1653 21.7993 13.7598 21.4266 14.9488C20.5298 17.8103 19.0226 20.2944 15.6462 20.8904C15.0255 20.9999 14.3271 20.9999 12.9303 20.9999H11.0697C9.6729 20.9999 8.9745 20.9999 8.35384 20.8904C4.97739 20.2944 3.47018 17.8103 2.57336 14.9488C2.20072 13.7598 2.01439 13.1653 2.00132 12.6843C1.94512 10.6169 3.6923 9.07354 5.75001 8.99994"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 14L12 3M12 14C11.2998 14 9.99153 12.0057 9.5 11.5M12 14C12.7002 14 14.0085 12.0057 14.5 11.5"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: 'inherit',
              }}
            >
              Télécharger le résumé généré
            </Typography>
          </Box>
        </React.Fragment>
      )}

      {/* Texte du résumé */}
      <Box
        sx={{
          maxHeight: '200px',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          position: 'relative',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.9rem',
            textAlign: 'justify',
            color: 'text.primary',
            paddingBottom: '24px',
          }}
        >
          {summary}
        </Typography>
      </Box>
    </Box>
  </React.Fragment>
) : (
  // Contenu initial avant l'expansion
  <React.Fragment>
    {fileName ? (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontWeight: 'xl',
            fontSize: 'clamp(0.5rem, 1.3636rem + 2.1818vw, 1.5rem)',
            fontFamily: 'inherit',
            textAlign: 'justify',
          }}
        >
          {fileName} déposé avec succès !
        </Typography>
        {eta !== null && (
          <Typography sx={{ fontSize: 'sm', color: 'text.secondary', ml: 2 }}>
            ETA : {eta}s
          </Typography>
        )}
      </Box>
    ) : isDragActive ? (
      <Typography
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
          fontFamily: 'inherit',
          textAlign: 'justify',
        }}
      >
        Déposez vos fichiers ici...
      </Typography>
    ) : (
      <Typography
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(0.875rem, 1.2rem + 1.5vw, 1.25rem)',
          fontFamily: 'inherit',
          textAlign: 'justify',
        }}
      >
        Glissez ou déposez votre fichier ici
      </Typography>
    )}
  </React.Fragment>
)}


  
  
          {isLoading && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: 6,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}