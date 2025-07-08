import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import questionsByAgeGroup from '../questions_by_age_group.json';
import jsPDF from 'jspdf';

function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  if (!formData) {
    // If no data, redirect to home
    navigate('/');
    return null;
  }

  const { childAge } = formData;
  const questions = questionsByAgeGroup[childAge] || [];

  // PDF download handler
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;
    const lineHeight = 10;
    const titleFontSize = 20;
    const subtitleFontSize = 16;
    const normalFontSize = 12;

    // Set title
    pdf.setFontSize(titleFontSize);
    pdf.setFont('helvetica', 'bold');
    const title = 'Math Assessment Result!';
    const titleWidth = pdf.getStringUnitWidth(title) * titleFontSize / pdf.internal.scaleFactor;
    pdf.text(title, (pageWidth - titleWidth) / 2, yPos);
    yPos += lineHeight * 2;

    // Set subtitle
    pdf.setFontSize(subtitleFontSize);
    pdf.setFont('helvetica', 'normal');
    const subtitle = `Here's what we discovered about your child's math skills!`;
    const subtitleWidth = pdf.getStringUnitWidth(subtitle) * subtitleFontSize / pdf.internal.scaleFactor;
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPos);
    yPos += lineHeight * 3;

    // Add questions and feedback
    pdf.setFontSize(normalFontSize);
    questions.forEach((q, idx) => {
      const stepKey = `step${idx + 1}`;
      const answer = formData[stepKey];
      const optionObj = q.options.find(opt => opt.text === answer);
      const feedback = optionObj ? optionObj.feedback : null;
      const childDisplayName = 'your child';
      const message = feedback && feedback.message ? feedback.message.replace(/\[Child[''`]s Name\]/g, childDisplayName) : '';
      const whyThisMatters = feedback && feedback.why_this_matters ? feedback.why_this_matters.replace(/\[Child[''`]s Name\]/g, childDisplayName) : '';

      // Check if we need a new page
      if (yPos > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPos = 20;
      }

      // Question result
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Q${idx + 1} Result: ${feedback ? feedback.identified_issue : 'No data'}`, margin, yPos);
      yPos += lineHeight * 1.5;

      // Strengths
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(61, 194, 194); // #3DC2C2
      pdf.text('Strengths:', margin, yPos);
      yPos += lineHeight;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(85, 85, 85); // #555555
      const strengths = feedback ? feedback.strength : '-';
      const strengthsLines = pdf.splitTextToSize(strengths, pageWidth - (margin * 2));
      pdf.text(strengthsLines, margin, yPos);
      yPos += lineHeight * strengthsLines.length + lineHeight;

      // Areas to Improve
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(126, 197, 106); // #7EC56A
      pdf.text('Areas to Improve:', margin, yPos);
      yPos += lineHeight;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(85, 85, 85); // #555555
      const improvements = feedback ? feedback.improve : '-';
      const improvementsLines = pdf.splitTextToSize(improvements, pageWidth - (margin * 2));
      pdf.text(improvementsLines, margin, yPos);
      yPos += lineHeight * improvementsLines.length + lineHeight;

      // Message
      if (message) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(0, 0, 0);
        const formattedMessage = message.startsWith('"') && message.endsWith('"') ? message : `"${message}"`;
        const messageLines = pdf.splitTextToSize(formattedMessage, pageWidth - (margin * 2));
        pdf.text(messageLines, margin, yPos);
        yPos += lineHeight * messageLines.length + lineHeight;
      }

      // Why This Matters
      if (whyThisMatters) {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(123, 63, 169); // #7B3FA9
        const whyLines = pdf.splitTextToSize(whyThisMatters, pageWidth - (margin * 2));
        pdf.text(whyLines, margin, yPos);
        yPos += lineHeight * whyLines.length + lineHeight * 2;
      }

      // Reset text color
      pdf.setTextColor(0, 0, 0);
    });

    pdf.save('assessment-math-result.pdf');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Box>
        <div>
          <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: 'Gilroy-ExtraBold, sans-serif',
              fontWeight: 600,
              fontSize: '45px',
              lineHeight: '88%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: 'black',
              mb: 2
            }}
          >
            Math Assessment Result!
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Gilroy-Medium, sans-serif',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: 'black',
              mb: 4
            }}
          >
            {`Here's what we discovered about your child's math skills!`}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '50px', mb: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <svg width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.11426 15.4531C3.08152 15.4531 3.04952 15.4661 3.02637 15.4893C3.00322 15.5124 2.99023 15.5444 2.99023 15.5771V30.5146C2.99025 30.5472 3.00346 30.5785 3.02637 30.6016C3.04951 30.6247 3.08152 30.6377 3.11426 30.6377H7.71875V15.4531H3.11426ZM10.459 32.0117C10.4548 32.3276 10.3434 32.6311 10.1445 32.873L10.0537 32.9727C9.79845 33.2279 9.45373 33.3741 9.09277 33.3789H3.1123C2.35453 33.3745 1.62861 33.071 1.09277 32.5352C0.557074 31.9993 0.254293 31.2734 0.25 30.5156V15.5752L0.265625 15.293C0.33386 14.6391 0.623888 14.0245 1.09277 13.5557C1.62861 13.0198 2.35453 12.7173 3.1123 12.7129H9.09277L9.22656 12.7217C9.53799 12.7561 9.83024 12.8948 10.0537 13.1182L10.1445 13.2188C10.3433 13.4607 10.4549 13.7643 10.459 14.0801V32.0117Z" fill="#3DC2C2" stroke="#3DC2C2" stroke-width="0.5"/>
                <path d="M18.6074 0.837891L18.8545 0.847656C19.4299 0.887088 19.9927 1.04055 20.5098 1.2998L20.7285 1.41699C21.2286 1.70445 21.6672 2.08929 22.0186 2.54883L22.1631 2.74902C22.487 3.22657 22.7134 3.76483 22.8281 4.33203L22.8701 4.5752C22.9522 5.14628 22.9206 5.72898 22.7754 6.28906L22.7734 6.29297L20.5762 14.207H27.9111L28.1494 14.2139C28.705 14.2458 29.2507 14.3841 29.7559 14.6211L29.9688 14.7285C30.4588 14.9919 30.8951 15.3466 31.2529 15.7744L31.4004 15.9619C31.7335 16.4076 31.9792 16.9132 32.123 17.4521L32.1787 17.6846C32.2926 18.2289 32.302 18.7908 32.2051 19.3398L32.2041 19.3418L30.3076 29.7979V29.7988C30.1341 30.7403 29.6564 31.597 28.9512 32.2393L28.8076 32.3643C28.0725 32.9773 27.1578 33.3318 26.2051 33.375L26.0137 33.3789H9.08594C8.76998 33.3748 8.46664 33.2625 8.22461 33.0635L8.12402 32.9736C7.86872 32.7183 7.72347 32.3728 7.71875 32.0117V14.082L7.73242 13.8926C7.7584 13.7051 7.82059 13.5237 7.91699 13.3594L7.9209 13.3535L14.4482 2.89746C14.8397 2.2668 15.3863 1.74719 16.0352 1.38672L16.2822 1.25879C16.8667 0.981308 17.5069 0.83714 18.1562 0.837891H18.6074ZM17.9463 3.55664C17.8114 3.57079 17.6789 3.60218 17.5518 3.64941L17.3652 3.73242C17.1232 3.85912 16.9174 4.04557 16.7666 4.27344L10.459 14.4688V30.6387H26.0156L26.1553 30.6338C26.4796 30.6091 26.7898 30.4859 27.0439 30.2793C27.3341 30.0434 27.533 29.7136 27.6055 29.3467L29.502 18.8936C29.533 18.7193 29.5352 18.5414 29.5088 18.3672L29.4727 18.1943C29.4271 18.0231 29.3536 17.8607 29.2559 17.7139L29.1504 17.5723C29.0366 17.4363 28.9008 17.3203 28.75 17.2285L28.5947 17.1445C28.4341 17.0695 28.2624 17.0213 28.0869 17.002L27.9102 16.9922H18.7988C18.6393 16.9922 18.4813 16.9642 18.332 16.9102L18.1855 16.8477C17.9953 16.7525 17.8297 16.6145 17.7021 16.4443V16.4434C17.6062 16.3187 17.5328 16.1787 17.4863 16.0293L17.4492 15.876C17.4204 15.7197 17.4197 15.56 17.4473 15.4043L17.4834 15.251L20.1553 5.59277L20.1943 5.41113C20.2131 5.28902 20.2175 5.16518 20.208 5.04199L20.1836 4.8584C20.1482 4.67575 20.0816 4.50108 19.9873 4.3418L19.8838 4.1875C19.7338 3.98999 19.5403 3.82954 19.3184 3.71875C19.1518 3.6356 18.9721 3.58257 18.7881 3.56055L18.6035 3.54883H18.1504L17.9463 3.55664Z" fill="#3DC2C2" stroke="#3DC2C2" stroke-width="0.5"/>
              </svg>
              <Typography sx={{ fontFamily: 'Gilroy-SemiBold, sans-serif', fontWeight: 600, fontSize: '20px', color: '#3DC2C2', ml: 2 }}>Strengths</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <svg width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.0088 4.8457C30.6426 4.32417 31.5783 4.36093 32.1689 4.95703L32.2793 5.08105C32.7604 5.67657 32.7605 6.53536 32.2793 7.13086L32.1689 7.25488L17.6318 21.9258C17.0413 22.5218 16.1055 22.5593 15.4717 22.0381L15.3486 21.9258L9.89746 16.4238C9.26876 15.7892 9.2687 14.7615 9.89746 14.127L10.0195 14.0156C10.6532 13.4937 11.5889 13.5309 12.1797 14.127L16.4893 18.4766L29.8857 4.95703L30.0088 4.8457Z" fill="#7EC56A" stroke="#7EC56A" stroke-width="0.5"/>
                <path d="M16.4902 0.8125C18.3997 0.812534 20.2349 1.14818 21.9395 1.76465L22.0928 1.82812C22.7817 2.15996 23.1437 2.93783 22.9609 3.68262L22.9141 3.8418C22.6331 4.63317 21.8038 5.07089 21.0088 4.87207L20.8506 4.82422C19.4905 4.33229 18.0231 4.06351 16.4902 4.06348C9.35446 4.06348 3.56543 9.90213 3.56543 17.1094C3.56544 24.3166 9.35447 30.1553 16.4902 30.1553C23.6259 30.1551 29.414 24.3165 29.4141 17.1094C29.4141 16.2138 30.1344 15.4844 31.0273 15.4844C31.9202 15.4844 32.6396 16.2138 32.6396 17.1094C32.6396 26.1076 25.4117 33.4061 16.4902 33.4062C7.56862 33.4062 0.339858 26.1077 0.339844 17.1094C0.339844 8.11105 7.56861 0.8125 16.4902 0.8125Z" fill="#7EC56A" stroke="#7EC56A" stroke-width="0.5"/>
              </svg>
              <Typography sx={{ fontFamily: 'Gilroy-SemiBold, sans-serif', fontWeight: 600, fontSize: '20px', color: '#7EC56A', ml: 2 }}>Areas to Improve</Typography>
            </Box>
          </Box>
          {questions.map((q, idx) => {
            const stepKey = `step${idx + 1}`;
            const answer = formData[stepKey];
            // Find the option object that matches the selected answer
            const optionObj = q.options.find(opt => opt.text === answer);
            const feedback = optionObj ? optionObj.feedback : null;
            // Replace [Child's Name] with actual child name in message and why_this_matters
            const message = feedback && feedback.message ? feedback.message.replace(/\[Child[''`]s Name\]/g, 'your child') : '';
            const whyThisMatters = feedback && feedback.why_this_matters ? feedback.why_this_matters.replace(/\[Child[''`]s Name\]/g, 'your child') : '';
            return (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    mb: 1, 
                    color: 'black'
                  }}
                >
                  Q{idx + 1} Result: {feedback ? feedback.identified_issue : 'No data'}
                </Typography>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 1)',
                  border: '1px solid rgba(225, 225, 225, 1)',
                  boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.07)',
                  borderRadius: '16px',
                  p: 3,
                  mt: 1
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    mb: 2,
                  }}>
                    {/* Strength Box */}
                    <Box sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: 'rgba(235, 255, 255, 1)',
                      border: '1px solid rgba(168, 231, 231, 1)',
                      borderRadius: '12px',
                      p: 2,
                      minHeight: '60px',
                      mr: 1
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                        <svg width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 12 }}>
                          <path d="M3.11426 15.4531C3.08152 15.4531 3.04952 15.4661 3.02637 15.4893C3.00322 15.5124 2.99023 15.5444 2.99023 15.5771V30.5146C2.99025 30.5472 3.00346 30.5785 3.02637 30.6016C3.04951 30.6247 3.08152 30.6377 3.11426 30.6377H7.71875V15.4531H3.11426ZM10.459 32.0117C10.4548 32.3276 10.3434 32.6311 10.1445 32.873L10.0537 32.9727C9.79845 33.2279 9.45373 33.3741 9.09277 33.3789H3.1123C2.35453 33.3745 1.62861 33.071 1.09277 32.5352C0.557074 31.9993 0.254293 31.2734 0.25 30.5156V15.5752L0.265625 15.293C0.33386 14.6391 0.623888 14.0245 1.09277 13.5557C1.62861 13.0198 2.35453 12.7173 3.1123 12.7129H9.09277L9.22656 12.7217C9.53799 12.7561 9.83024 12.8948 10.0537 13.1182L10.1445 13.2188C10.3433 13.4607 10.4549 13.7643 10.459 14.0801V32.0117Z" fill="#3DC2C2" stroke="#3DC2C2" stroke-width="0.5"/>
                          <path d="M18.6074 0.837891L18.8545 0.847656C19.4299 0.887088 19.9927 1.04055 20.5098 1.2998L20.7285 1.41699C21.2286 1.70445 21.6672 2.08929 22.0186 2.54883L22.1631 2.74902C22.487 3.22657 22.7134 3.76483 22.8281 4.33203L22.8701 4.5752C22.9522 5.14628 22.9206 5.72898 22.7754 6.28906L22.7734 6.29297L20.5762 14.207H27.9111L28.1494 14.2139C28.705 14.2458 29.2507 14.3841 29.7559 14.6211L29.9688 14.7285C30.4588 14.9919 30.8951 15.3466 31.2529 15.7744L31.4004 15.9619C31.7335 16.4076 31.9792 16.9132 32.123 17.4521L32.1787 17.6846C32.2926 18.2289 32.302 18.7908 32.2051 19.3398L32.2041 19.3418L30.3076 29.7979V29.7988C30.1341 30.7403 29.6564 31.597 28.9512 32.2393L28.8076 32.3643C28.0725 32.9773 27.1578 33.3318 26.2051 33.375L26.0137 33.3789H9.08594C8.76998 33.3748 8.46664 33.2625 8.22461 33.0635L8.12402 32.9736C7.86872 32.7183 7.72347 32.3728 7.71875 32.0117V14.082L7.73242 13.8926C7.7584 13.7051 7.82059 13.5237 7.91699 13.3594L7.9209 13.3535L14.4482 2.89746C14.8397 2.2668 15.3863 1.74719 16.0352 1.38672L16.2822 1.25879C16.8667 0.981308 17.5069 0.83714 18.1562 0.837891H18.6074ZM17.9463 3.55664C17.8114 3.57079 17.6789 3.60218 17.5518 3.64941L17.3652 3.73242C17.1232 3.85912 16.9174 4.04557 16.7666 4.27344L10.459 14.4688V30.6387H26.0156L26.1553 30.6338C26.4796 30.6091 26.7898 30.4859 27.0439 30.2793C27.3341 30.0434 27.533 29.7136 27.6055 29.3467L29.502 18.8936C29.533 18.7193 29.5352 18.5414 29.5088 18.3672L29.4727 18.1943C29.4271 18.0231 29.3536 17.8607 29.2559 17.7139L29.1504 17.5723C29.0366 17.4363 28.9008 17.3203 28.75 17.2285L28.5947 17.1445C28.4341 17.0695 28.2624 17.0213 28.0869 17.002L27.9102 16.9922H18.7988C18.6393 16.9922 18.4813 16.9642 18.332 16.9102L18.1855 16.8477C17.9953 16.7525 17.8297 16.6145 17.7021 16.4443V16.4434C17.6062 16.3187 17.5328 16.1787 17.4863 16.0293L17.4492 15.876C17.4204 15.7197 17.4197 15.56 17.4473 15.4043L17.4834 15.251L20.1553 5.59277L20.1943 5.41113C20.2131 5.28902 20.2175 5.16518 20.208 5.04199L20.1836 4.8584C20.1482 4.67575 20.0816 4.50108 19.9873 4.3418L19.8838 4.1875C19.7338 3.98999 19.5403 3.82954 19.3184 3.71875C19.1518 3.6356 18.9721 3.58257 18.7881 3.56055L18.6035 3.54883H18.1504L17.9463 3.55664Z" fill="#3DC2C2" stroke="#3DC2C2" stroke-width="0.5"/>
                        </svg>
                        <Typography sx={{ fontFamily: 'Gilroy-SemiBold, sans-serif', fontWeight: 600, fontSize: '20px', color: '#3DC2C2', ml: 2 }}>Strengths</Typography>
                      </Box>
                      <Typography sx={{
                        color: 'rgba(85, 85, 85, 1)',
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '100%',
                        letterSpacing: '0%'
                      }}>
                        {feedback ? feedback.strength : '-'}
                      </Typography>
                    </Box>
                    {/* Areas to Improve Box */}
                    <Box sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: 'rgba(234, 255, 228, 1)',
                      border: '1px solid rgba(180, 255, 159, 1)',
                      borderRadius: '12px',
                      p: 2,
                      minHeight: '60px',
                      ml: 1
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                        <svg width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 12 }}>
                          <path d="M30.0088 4.8457C30.6426 4.32417 31.5783 4.36093 32.1689 4.95703L32.2793 5.08105C32.7604 5.67657 32.7605 6.53536 32.2793 7.13086L32.1689 7.25488L17.6318 21.9258C17.0413 22.5218 16.1055 22.5593 15.4717 22.0381L15.3486 21.9258L9.89746 16.4238C9.26876 15.7892 9.2687 14.7615 9.89746 14.127L10.0195 14.0156C10.6532 13.4937 11.5889 13.5309 12.1797 14.127L16.4893 18.4766L29.8857 4.95703L30.0088 4.8457Z" fill="#7EC56A" stroke="#7EC56A" stroke-width="0.5"/>
                          <path d="M16.4902 0.8125C18.3997 0.812534 20.2349 1.14818 21.9395 1.76465L22.0928 1.82812C22.7817 2.15996 23.1437 2.93783 22.9609 3.68262L22.9141 3.8418C22.6331 4.63317 21.8038 5.07089 21.0088 4.87207L20.8506 4.82422C19.4905 4.33229 18.0231 4.06351 16.4902 4.06348C9.35446 4.06348 3.56543 9.90213 3.56543 17.1094C3.56544 24.3166 9.35447 30.1553 16.4902 30.1553C23.6259 30.1551 29.414 24.3165 29.4141 17.1094C29.4141 16.2138 30.1344 15.4844 31.0273 15.4844C31.9202 15.4844 32.6396 16.2138 32.6396 17.1094C32.6396 26.1076 25.4117 33.4061 16.4902 33.4062C7.56862 33.4062 0.339858 26.1077 0.339844 17.1094C0.339844 8.11105 7.56861 0.8125 16.4902 0.8125Z" fill="#7EC56A" stroke="#7EC56A" stroke-width="0.5"/>
                        </svg>
                        <Typography sx={{ fontFamily: 'Gilroy-SemiBold, sans-serif', fontWeight: 600, fontSize: '20px', color: '#7EC56A', ml: 2 }}>Areas to Improve</Typography>
                      </Box>
                      <Typography sx={{
                        color: 'rgba(85, 85, 85, 1)',
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '100%',
                        letterSpacing: '0%'
                      }}>
                        {feedback ? feedback.improve : '-'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ textAlign: 'center', mb: 0.5 }}>
                    {message ? (message.startsWith('"') && message.endsWith('"') ? message : `"${message}"`) : ''}
                  </Typography>
                  <Typography sx={{ color: 'rgba(123, 63, 169, 1)', fontSize: '0.95rem', textAlign: 'center' }}>
                    {whyThisMatters}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </div>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>Back to Home</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AssessmentResult; 