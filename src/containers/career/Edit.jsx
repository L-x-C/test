import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import ProfileForm from '../../components/career/profileForm.jsx';
import ObjectiveForm from '../../components/career/objectiveForm.jsx';
import EducationForm from '../../components/career/educationForm.jsx';
import ExperienceForm from '../../components/career/experienceForm.jsx';
import SkillForm from '../../components/career/skillForm.jsx';
import WorksForm from '../../components/career/worksForm.jsx';
import HobbyForm from '../../components/career/hobbyForm.jsx';
import HonorForm from '../../components/career/honorsForm.jsx';
import IssueForm from '../../components/career/issueForm.jsx';
import OthersForm from '../../components/career/othersForm.jsx';

import isEmpty from 'lodash/isEmpty';

class CareerEdit extends Component {
  static propTypes = {
    location: PropTypes.object,
    type: PropTypes.string,
    jobId: PropTypes.string
  }
  render() {
    const {type, jobId} = this.props;
    return (
      <div>
        {type === 'profiles' && <ProfileForm jobId={jobId}/>}
        {type === 'objective' && <ObjectiveForm jobId={jobId}/>}
        {type === 'educations' && <EducationForm jobId={jobId}/>}
        {type === 'experiences' && <ExperienceForm jobId={jobId}/>}
        {type === 'honors' && <HonorForm jobId={jobId}/>}
        {type === 'skills' && <SkillForm jobId={jobId}/>}
        {type === 'works' && <WorksForm jobId={jobId}/>}
        {type === 'hobbies' && <HobbyForm jobId={jobId}/>}
        {type === 'issues' && <IssueForm jobId={jobId}/>}
        {type === 'others' && <OthersForm jobId={jobId}/>}
      </div>
    );

  }
}

// inject dispatch
export default connect(null, null)(CareerEdit);
