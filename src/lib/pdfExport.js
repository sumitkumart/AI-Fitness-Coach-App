// PDF export service using jsPDF

import jsPDF from "jspdf";

export function exportToPDF(plan) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text("AI Fitness Coach Plan", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // User Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${plan.userData.name}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Goal: ${plan.userData.fitnessGoal}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Level: ${plan.userData.fitnessLevel}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Location: ${plan.userData.workoutLocation}`, 20, yPosition);
  yPosition += 15;

  // Motivational Tip
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text("Motivational Tip:", 20, yPosition);
  yPosition += 7;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const tipLines = doc.splitTextToSize(plan.motivationalTip, pageWidth - 40);
  doc.text(tipLines, 20, yPosition);
  yPosition += tipLines.length * 7 + 10;

  // Workout Plan
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text("Workout Plan", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  plan.workoutPlan.exercises.forEach((exercise, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${exercise.name}`, 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (exercise.sets) {
      doc.text(`   Sets: ${exercise.sets}`, 25, yPosition);
      yPosition += 6;
    }
    if (exercise.reps) {
      doc.text(`   Reps: ${exercise.reps}`, 25, yPosition);
      yPosition += 6;
    }
    if (exercise.rest && exercise.rest !== "N/A") {
      doc.text(`   Rest: ${exercise.rest}`, 25, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  });

  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  // Tips
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tips:", 20, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  plan.workoutPlan.tips.forEach((tip) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 40);
    doc.text(tipLines, 25, yPosition);
    yPosition += tipLines.length * 6 + 3;
  });

  // Diet Plan
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text("Diet Plan", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const meals = [
    { name: "Breakfast", content: plan.dietPlan.breakfast },
    { name: "Lunch", content: plan.dietPlan.lunch },
    { name: "Dinner", content: plan.dietPlan.dinner },
    { name: "Snacks", content: plan.dietPlan.snacks },
  ];

  meals.forEach((meal) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(meal.name + ":", 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const mealLines = doc.splitTextToSize(meal.content, pageWidth - 40);
    doc.text(mealLines, 25, yPosition);
    yPosition += mealLines.length * 6 + 8;
  });

  // Save PDF
  doc.save(`Fitness-Plan-${plan.userData.name}-${new Date().toISOString().split("T")[0]}.pdf`);
}
