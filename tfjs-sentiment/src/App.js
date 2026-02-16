import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import './App.css'
import MenuIcon from "@mui/icons-material/Menu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const animationFrame = useRef(null);

  // load model
  async function loadModel() {
    try {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("Model loaded successfully");
    } catch (err) {
      console.log("Failed to load model:", err);
    }
  }

  useEffect(() => {
    // wait for tensorflow to init (GPU/CPU for ai)
    tf.ready().then(() => { 
      loadModel();
    });

    // clean up on unmount
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // start detection loop when model is ready
  useEffect(() => {
    if (model) {
      predictionFunction();
    }
  }, [model]);

  async function predictionFunction() {
    // if not loaded, schedule fun to run again on next frame
    if (!model || !webcamRef.current || !webcamRef.current.video) {
      animationFrame.current = requestAnimationFrame(predictionFunction);
      return;
    }

    const video = webcamRef.current.video;
    
    // check if video is ready (if not, try again on next frame)
    if (video.readyState !== 4) {
      animationFrame.current = requestAnimationFrame(predictionFunction);
      return;
    }

    try {
      const predictions = await model.detect(video);

      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrame.current = requestAnimationFrame(predictionFunction);
        return;
      }
      
      const ctx = canvas.getContext("2d");
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear previous drawings

      // filter only cell phones
      const phoneDetections = predictions.filter(
        prediction => prediction.class === "cell phone" && prediction.score > 0.0
      );

      // loop through each detected phone
      if (phoneDetections.length > 0) {
        console.log("Phone detected:", phoneDetections);
        
        phoneDetections.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;

          // draw box
          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          // label background
          ctx.fillStyle = "#00FF00";
          ctx.fillRect(x, y - 35, width, 35);

          // label text
          ctx.fillStyle = "#000000";
          ctx.font = "bold 24px Arial";
          ctx.fillText(
            `📱 ${prediction.class.toUpperCase()} ${Math.round(prediction.score * 100)}%`,
            x + 5,
            y - 10
          );
        });
      }
    } catch (error) {
      console.error("Detection error:", error);
    }

    // schedule next prediction
    animationFrame.current = requestAnimationFrame(predictionFunction);
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        marginTop: -8,
        backgroundImage:
          "radial-gradient( circle 993px at 0.5% 50.5%,  rgba(137,171,245,0.37) 0%, rgba(245,247,252,1) 100.2% )",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            📱 Phone Detection
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid
        container
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          padding: 20,
        }}
      >
        <Grid
          item
          xs={12}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box mt={3} />
          
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            {model ? "🟢 Detecting phones..." : "⏳ Loading model..."}
          </Typography>
          
          <div style={{ position: "relative", width: "100%", maxWidth: "1280px" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotQuality={1}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;