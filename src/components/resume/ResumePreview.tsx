import { forwardRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplate from './CreativeTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import ModernTemplate from './ModernTemplate';
import CompactTemplate from './CompactTemplate';

const ResumePreview = forwardRef<HTMLDivElement, {}>((_, ref) => {
  const template = useResumeStore(state => state.template);

  const renderTemplate = () => {
    switch (template) {
      case 'creative':    return <CreativeTemplate />;
      case 'minimal':     return <MinimalTemplate />;
      case 'executive':   return <ExecutiveTemplate />;
      case 'modern':      return <ModernTemplate />;
      case 'compact':     return <CompactTemplate />;
      default:            return <ProfessionalTemplate />;
    }
  };

  return (
    <div ref={ref} className="resume-a4">
      {renderTemplate()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
