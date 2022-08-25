import styled from "styled-components";
import Button from "./Button";
import EyeSideImage from "../assets/retina.png";
import RetinaImage from "../assets/retina-photo.png";
import PlaceholderImage from "../assets/placeholder.png";
import DiagramImage from "../assets/diagram.png";
import CheckIcon from "../assets/icons/tick-circle.svg";
import CloseIcon from "../assets/icons/close-circle.svg";
import { ReactComponent as UploadIcon } from "../assets/icons/arrow-up-1.svg";
import { ReactComponent as DropzoneIcon } from "../assets/icons/gallery-add.svg";
import StepWrapper from "./StepWrapper";
import Dropzone from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import AdviceList from "./AdviceList";
import PatientForm from "./PatientForm";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import auth from "../firebaseAuth";
// import * as cv from "opencv.js";

const B = styled.b`
  font-weight: ${(props) => props.weight || "bold"}; ;
`;

const StyledStep = styled.div`
  h1 {
    margin-bottom: 1rem;
    @media (max-width: 800px) {
      font-size: 1.3rem;
    }
  }
  button {
    margin-bottom: 1rem;
  }
  .stepContent {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    img {
      max-width: 300px;
      @media (max-width: 1100px) {
        width: 300px;
      }
    }
  }
  .textWrapper {
    width: 50%;
    text-align: justify;
    p {
      font-size: ${(props) => props.size || "16px"};
      line-height: 1.4em;
      margin-bottom: 1rem;
    }
    @media (max-width: 800px) {
      font-size: 10px;
      width: 100%;
    }
  }
  &.results {
    .stepContent > img {
      opacity: 0.2;
      width: 300px;
    }
  }
  &.upload {
    .UploadButton {
      margin-bottom: 1rem;
    }
    .textWrapper {
      @media (max-width: 800px) {
        display: none;
      }
    }
  }
`;

const StyledDone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProccesingFacts = styled.div`
  position: relative;
  padding-top: 4rem;
  padding-left: 2rem;
  z-index: 1;
  .diagramImage {
    width: 150px;
    position: absolute;
    top: -1rem;
    left: 0;
    z-index: -1;
    @media (max-width: 800px) {
      display: none;
    }
  }
  @media (max-width: 800px) {
    padding: 0;
  }
`;

const ToolStepper = () => {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPredicitng, setIsPredicitng] = useState(false);
  const [done, setdone] = useState(false);

  const getPrediction = async (imageURL) => {
    setCurrentStep((currentStep) => currentStep + 1);
    setIsPredicitng(true);
    let res = await fetch("http://164.92.206.127/flask/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: imageURL }),
    });
    let prediction = await res.json();
    setIsPredicitng(false);
    setTimeout(() => {
      setResult(prediction.diagnosis);
    }, 2000);
  };

  useEffect(() => {
    if (result !== null) setCurrentStep((currentStep) => currentStep + 1);
  }, [result]);

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const photoURL = reader.result;
      setPhoto(photoURL);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);
  if (!done)
    return (
      <StepWrapper
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        isPredicitng={isPredicitng}
        result={result}
        photo={photo}
        getPrediction={getPrediction}
      >
        <StyledStep label="Welcome">
          <h1>
            Welcome to the Diabetic <B>Retinopathy Detection Tool</B>
          </h1>
          <div className="stepContent">
            <div className="textWrapper">
              <p>
                <B weight={600}>Diabetic retinopathy</B> is the leading cause of
                blindness in the working-age population of the developed world.
                It is estimated to affect over 93 million people.
              </p>
              <p>
                Currently, detecting DR is a time-consuming and manual process
                that requires a trained clinician to examine and evaluate
                digital color fundus photographs of the retina.
              </p>
              <p>
                This tool is developed and maintained by a team of students in{" "}
                <B weight={600}>
                  The Faculty of Computing and Data Science at Alexandria
                  University, Egypt
                </B>
                . It aims to help medical professionals diagnose patients
                suffering from Diabectic Retinopathy using the power of Machine
                Learning.
              </p>
            </div>
            <img src={EyeSideImage} alt="" />
          </div>
        </StyledStep>
        <StyledStep size="1.3em" label="How to use?">
          <h1>
            <B>How to use this tool</B>
          </h1>
          <div className="stepContent">
            <div className="textWrapper">
              <p>
                This model utilizes image classification, pattern recognition,
                and machine learning to analyse retinal photographs and detect
                diabetic retinopathy.
              </p>
              <p>
                You are required to upload a
                <B> clear color fundus retinal photograph.</B>
              </p>
              <p>
                <B>You can find an example photo to the right.</B>
              </p>
            </div>
            <img src={RetinaImage} alt="" />
          </div>
        </StyledStep>
        <StyledStep label="Upload Photo" className="upload">
          <Button
            upload
            setPhoto={setPhoto}
            reversed
            color="white"
            text="#15668a"
            Icon={UploadIcon}
          >
            Upload Photo
          </Button>
          <div className="stepContent">
            <div className="textWrapper">
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <DropzoneIcon />
                      <p>Drop photo here</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <img src={!photo ? PlaceholderImage : photo} alt="" />
          </div>
        </StyledStep>
        <StyledStep size="1.3em" label="">
          <h1>
            <B>Please wait while you photo is being processed...</B>
          </h1>
          <div className="stepContent">
            <ProccesingFacts className="textWrapper">
              <img className="diagramImage" src={DiagramImage} alt="" />
              <p>
                The International Diabetes Federation (IDF) estimated the global
                population with diabetes mellitus (DM) to be 463 million in 2019
                and 700 million in 2045. <B>Diabetic retinopathy</B> remains a
                common complication of DM and a leading cause of preventable
                blindness in the adult working population.
              </p>
            </ProccesingFacts>
            <img src={photo ? photo : PlaceholderImage} alt="" />
          </div>
        </StyledStep>
        <StyledStep label="Results" className="results">
          {result === 0 && (
            <>
              <h1>
                Diagnosis:{" "}
                <span style={{ color: "#14a708", fontWeight: "bold" }}>
                  No Diabetic Retinopathy detected
                </span>
              </h1>
              <p>
                <B>Please advice patients to:</B>
              </p>
              <div className="stepContent">
                <AdviceList />
                <img src={CheckIcon} alt="" />
              </div>
            </>
          )}
          {result !== 0 && (
            <>
              <h1>
                Diagnosis:{" "}
                <span style={{ color: "#DD4242", fontWeight: "bold" }}>
                  {result === 1 ? "Mild" : "Severe"} Diabetic Retinopathy
                  detected
                </span>
              </h1>
              <div className="stepContent">
                <PatientForm setdone={setdone} />
                <img src={CloseIcon} alt="" />
              </div>
            </>
          )}
        </StyledStep>
      </StepWrapper>
    );
  else
    return (
      <StyledDone>
        <h1>
          Thank you for using our tool, we will get in contact with you soon
        </h1>
      </StyledDone>
    );
};

export default ToolStepper;
