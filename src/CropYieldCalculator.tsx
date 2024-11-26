import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import backgroundImage from './bg4.png';
import truck from './trcuk.png';
import bag from './bag.png';
import resultbg from './rs.png';

const CropYieldCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [calcType, setCalcType] = useState<string>('direct');
  const [totalWeight, setTotalWeight] = useState<string>(''); 
  const [extraKgs, setExtraKgs] = useState<string>('0');
  const [selectedBagWeight, setSelectedBagWeight] = useState<string>('40'); 
  const [numberOfBags, setNumberOfBags] = useState<string>(''); 
  const [pricePerBag, setPricePerBag] = useState<string>('');
  const [name1, setName1] = useState<string>('');
  const [result, setResult] = useState<{ bags: number; total: number; name1: string } | null>(null);

  const calculateYield = () => {
    let bags: number;
    let totalAmount: number;

    if (calcType === 'direct') {
      const totalWeightInKgs = parseFloat(totalWeight) + parseFloat(extraKgs); 
      bags = totalWeightInKgs / 75;
      totalAmount = bags * parseFloat(pricePerBag);
    } else {
      const totalWeightInKgs = parseFloat(selectedBagWeight) * parseFloat(numberOfBags) + parseFloat(extraKgs);
      bags = totalWeightInKgs / 75;
      totalAmount = bags * parseFloat(pricePerBag);
    }

    setResult({ bags, total: totalAmount, name1 });
    setCurrentStep(2); 
  };


  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("Failed to get canvas 2D context.");
      return;
    }
  
    const img = new Image();
    img.src = resultbg; // Replace `resultbg` with the correct path to your image
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the background image on the canvas
      ctx.drawImage(img, 0, 0);
  
      // Set text properties
      ctx.fillStyle = 'black'; // Default text color
      ctx.font = 'bold 50px Arial'; // Increase font size and make text bold
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
  
      // Set starting positions and line height
      const startX = canvas.width / 2;
      let startY = canvas.height / 2.5 - 90; // Adjust starting Y position
      const lineHeight = 40; // Space between each line
  
      // Check if result and pricePerBag are not null/undefined
      if (result && pricePerBag !== undefined) {
        // Print each line, adding labels and values separately for better formatting
        
        // Farmer Name
        ctx.fillStyle = '#333'; // Darker color
        ctx.fillText('Farmer Name', startX, startY);
        startY += lineHeight * 2;
        ctx.fillText(result.name1, startX, startY);
  
        // Number Of Rice Bags
        startY += lineHeight * 3; // Increase space between sections
        ctx.fillStyle = '#333'; // Color for the second section
        ctx.fillText('Number Of Rice Bags', startX, startY);
        startY += lineHeight * 2;
        ctx.fillText(result.bags.toFixed(2), startX, startY);
  
        // Price of Each Rice Bag
        startY += lineHeight * 3;
        ctx.fillStyle = '#333'; // Color for the third section
        ctx.fillText('Price of Each Rice Bag', startX, startY);
        startY += lineHeight * 2;
        ctx.fillText(`₹ ${pricePerBag}`, startX, startY);
  
        // Total Amount
        startY += lineHeight * 3;
        ctx.fillStyle = '#333'; // Color for the fourth section
        ctx.fillText('Total Amount', startX, startY);
        startY += lineHeight * 2;
        ctx.fillText(`₹ ${result.total.toFixed(2)}`, startX, startY);
      }
  
      // Convert canvas to image and trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
  
          // Set the downloaded image name as the farmer's name, ensure `result` is not null
          a.download = `${result?.name1 || 'default'}.png`;
  
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          console.error("Failed to create blob from canvas.");
        }
      });
    };
  
    img.onerror = () => {
      console.error("Failed to load image.");
    };
  };
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Container
    maxWidth="sm"
    sx={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      minHeight: '95vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '25px'
    }}
  >  
   <Paper 
      elevation={3} 
      sx={{ 
        padding: 2, 
        borderRadius: 2, 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        width: '90%', 
        marginTop: 'auto' 
      }}
    >
      {currentStep === 0 && (
        <Box sx={{marginBottom: 2}}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Select Calculation Type
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img
                src={truck}
                alt="Direct Weight Calculation"
                style={{ width: 100, height: 100, marginRight: 8, cursor: 'pointer' }}
                onClick={() => {
                  setCalcType('direct');
                  handleNext();
                }}
              />
              <Button
                sx={{borderRadius: 4, backgroundColor: "#0f9335"}}
                variant="contained"
                onClick={() => {
                  setCalcType('direct');
                  handleNext();
                }}
              >
                Direct Weight
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={bag}
                alt="Bag Weight Calculation"
                style={{ width: 100, height: 100, marginRight: 8, cursor: 'pointer' }}
                onClick={() => {
                  setCalcType('bags');
                  handleNext();
                }}
              />
              <Button
                sx={{borderRadius: 4, backgroundColor: "#0f9335"}}
                variant="contained"
                onClick={() => {
                  setCalcType('bags');
                  handleNext();
                }}
              >
                Bag Weight
              </Button>
            </Box>
          </Box>
        </Box>
      )}

        {currentStep === 1 && (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column',alignItems: 'center', marginTop: 2 }}>
            <TextField
              label="Farmer Name"
              variant="outlined"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              margin="normal"
              fullWidth
              sx={{
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#43db3b',
                  },
                  '&:hover fieldset': {
                    borderColor: '#43db3b',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#43db3b',
                  },
                },
                '& .MuiInputLabel-root': {
                  top: '-7px',
                  left: '3px',
                  color: '#555',
                  '&.MuiInputLabel-shrink': {
                    top: '-1px',
                    left: '-1px',
                    color: '#43db3b', 
                  },
                },
              }}
            />
            {calcType === 'direct' && (
              <>
                <TextField
                  label="Total Weight (in KGs)"
                  variant="outlined"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b', 
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />

                <TextField
                  label="Price of Each Rice Bag"
                  variant="outlined"
                  value={pricePerBag}
                  onChange={(e) => setPricePerBag(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b', 
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />
                <Box sx={{flex: 'display', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center'}}>
                  <Button
                    onClick={() => {
                      setCurrentStep(0); 
                    }}
                    sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335"}}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={calculateYield}
                    sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335"}}
                  >
                    Calculate
                  </Button>
                </Box>
                
              </>
            )}

            {calcType === 'bags' && (
              <>
                <TextField
                  label="Rice Bag Weight Type (40, 45, 50 KGs)"
                  variant="outlined"
                  value={selectedBagWeight}
                  onChange={(e) => setSelectedBagWeight(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />
                <TextField
                  label="Number of Rice bags"
                  variant="outlined"
                  value={numberOfBags}
                  onChange={(e) => setNumberOfBags(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />
                <TextField
                  label="Extra KGs Count"
                  variant="outlined"
                  value={extraKgs}
                  onChange={(e) => setExtraKgs(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />
                <TextField
                  label="Price of Each Rice Bag"
                  variant="outlined"
                  value={pricePerBag}
                  onChange={(e) => setPricePerBag(e.target.value)}
                  margin="normal"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&:hover fieldset': {
                        borderColor: '#43db3b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#43db3b',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px',
                      left: '3px',
                      color: '#555',
                      '&.MuiInputLabel-shrink': {
                        top: '-1px',
                        left: '-1px',
                        color: '#43db3b',
                      },
                    },
                  }}
                />
                <Box sx={{flex: 'display', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center'}}>
                  <Button
                    onClick={() => {
                      setCurrentStep(0);
                    }}
                    sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335"}}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={calculateYield}
                    sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335"}}
                  >
                    Calculate
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}

        {/* {currentStep === 1 && (
          <IconButton
            sx={{ position: 'absolute', top: 16, left: 16, borderRadius: '50%', bgcolor: 'primary.main' }}
            onClick={handleBack}
          >
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
        )} */}

        {currentStep === 2 && result && (
          <Box
            id="result"
            sx={{
              marginTop: 4,
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h5" align="center">
              Result
            </Typography>
            <Card variant="outlined" sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h6">Farmer Name: {result.name1}</Typography>
                <Typography variant="body1">
                  No of Rice Bags: {result.bags.toFixed(2)}
                </Typography>
                <Typography variant="body1">Price of Each Bag: ₹{pricePerBag}</Typography>
                <Typography variant="h6">
                  Total Amount: ₹{result.total.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Button
              variant="contained"
              color="primary"
              onClick={downloadImage}
              sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335", fontSize: 13}}
            >
              Download Result
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Button
                    onClick={() => {
                      setCurrentStep(1); 
                    }}
                    sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335", fontSize: 13}}
                  >
                    Back
                  </Button>
            <Button
                  onClick={() => {
                    setCurrentStep(0);
                  }}
                  sx={{p: 1, color: 'white', margin:2, borderRadius: 4, backgroundColor: "#0f9335", fontSize: 13}}
                >
                  Start Over
                </Button>
            </Box>
            </Box>
            
            
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CropYieldCalculator;
