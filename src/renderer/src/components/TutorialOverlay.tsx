import { useEffect, useState } from "react";

type Step = {
  targetId: string;
  title: string;
  description: string;
  position: "left" | "right" | "top" | "bottom" | "center";
};

const STEPS: Step[] = [
  {
    targetId: "", // center screen
    title: "Welcome to TempleCV",
    description: "Your local-first, deterministic resume builder. Let's take a quick tour of how to forge your career record.",
    position: "center"
  },
  {
    targetId: "tour-sidebar",
    title: "1. The Content Editor",
    description: "Navigate through your resume sections here. Update your experience, add projects, and attach local assets like headshots or company logos.",
    position: "right"
  },
  {
    targetId: "tour-design",
    title: "2. The Design Panel",
    description: "Customize your presentation without fighting word processors. Adjust typography, density, and swap the order of your sections.",
    position: "left"
  },
  {
    targetId: "tour-toolbar",
    title: "3. Export & Save",
    description: "When you're ready, save your portable .resume package or export to a pixel-perfect PDF, ATS-friendly PDF, HTML, or DOCX.",
    position: "left"
  },
  {
    targetId: "tour-preview",
    title: "4. Live Deterministic Preview",
    description: "What you see here is exactly what the ATS or recruiter sees. The preview updates instantly as you edit.",
    position: "top"
  }
];

export function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const disabled = localStorage.getItem("templecv_tutorial_disabled");
    if (!disabled) {
      // Small delay to let the app render
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = STEPS[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }

    const handleResize = () => {
      const el = step.targetId ? document.getElementById(step.targetId) : null;
      if (el) setTargetRect(el.getBoundingClientRect());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      finishTutorial();
    } else {
      setCurrentStep(c => c + 1);
    }
  };

  const finishTutorial = () => {
    setIsVisible(false);
    localStorage.setItem("templecv_tutorial_disabled", "true");
  };

  return (
    <div className="tutorial-overlay">
      {targetRect && (
        <div 
          className="tutorial-spotlight"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16
          }}
        />
      )}
      
      <div 
        className={`tutorial-card position-${step.position}`}
        style={getCardStyle(step.position, targetRect)}
      >
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        
        <div className="tutorial-actions">
          <button className="btn-disable" onClick={finishTutorial}>Skip Tour</button>
          <div className="tutorial-dots">
            {STEPS.map((_, i) => (
              <span key={i} className={i === currentStep ? "active" : ""} />
            ))}
          </div>
          <button className="btn-next" onClick={handleNext}>{isLast ? "Done" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}

function getCardStyle(position: Step["position"], rect: DOMRect | null): React.CSSProperties {
  if (!rect || position === "center") {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    };
  }

  // Positioning relative to the spotlight target
  if (position === "right") {
    return {
      top: rect.top + 20,
      left: rect.right + 24
    };
  }
  if (position === "left") {
    return {
      top: rect.top + 20,
      right: window.innerWidth - rect.left + 8
    };
  }
  if (position === "top") {
    return {
      bottom: window.innerHeight - rect.top + 8,
      left: "50%",
      transform: "translateX(-50%)"
    };
  }
  
  return {};
}
