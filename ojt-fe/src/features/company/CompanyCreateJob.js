// import briefcaseFill from "@iconify/icons-eva/checkmark-square-outline";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Form, FormikProvider, useFormik } from 'formik';
import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant='filled' {...props} />
));

const isEmpty = (value) => {
  const result = value.length === 0;
  return result;
};

const defaultField = {
  value: '',
  isTouched: false,
};

export default function CompanyCreateJob() {
  const axiosPrivate = useAxiosPrivate();
  const [jobAddName, setJobName] = useState({ ...defaultField });
  const [jobTitle, setJobTitle] = useState({ ...defaultField });
  const [jobSalary, setJobSalary] = useState({ ...defaultField });
  const [jobReason, setJobReason] = useState([{ ...defaultField }]);
  const [jobDescription, setJobDescription] = useState({ ...defaultField });
  const [jobAboutOurTeam, setJobAboutOurTeam] = useState({ ...defaultField });
  const [jobMustSkills, setMustSkills] = useState([{ ...defaultField }]);
  const [jobNiceSkills, setJobNiceSkills] = useState([{ ...defaultField }]);
  const [jobWhyYouWillLove, setWhyYouWillLove] = useState({ ...defaultField });
  const [jobBenefits, setJobBenefits] = useState([{ ...defaultField }]);
  const [jobSemesterIds, setJobSemesterIds] = useState(5);
  const [jobMajorIds, setMajorIds] = useState(1);
  const [jobResponsibilities, setResponsibilities] = useState([
    {
      ...defaultField,
    },
  ]);
  const [open, setOpen] = useState(false);
  const jobNameChange = (event) => {
    setJobName((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobTitleChange = (event) => {
    setJobTitle((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobSalaryChange = (event) => {
    setJobSalary((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobReasonChange = (event, index) => {
    const jobReasons = [...jobReason];
    jobReasons[index].value = event.target.value;
    setJobReason(jobReasons);
  };
  const jobDescriptionChange = (event) => {
    setJobDescription((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobAboutTeamChange = (event) => {
    setJobAboutOurTeam((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobMustSkillChange = (event, index) => {
    const mustHaveSkills = [...jobMustSkills];
    mustHaveSkills[index].value = event.target.value;
    setMustSkills(mustHaveSkills);
  };
  const jobNiceSkillChange = (event, index) => {
    const niceHaveSkills = [...jobNiceSkills];
    niceHaveSkills[index].value = event.target.value;
    setJobNiceSkills(niceHaveSkills);
  };
  const jobWhyLoveChange = (event) => {
    setWhyYouWillLove((prev) => ({ ...prev, value: event.target.value }));
  };
  const jobBenefitChange = (event, index) => {
    const benefits = [...jobBenefits];
    benefits[index].value = event.target.value;
    setJobBenefits(benefits);
  };
  const jobSemesterChange = (event) => {
    setJobSemesterIds(event.target.value);
  };
  const jobMajorIDChange = (event) => {
    setMajorIds(event.target.value);
  };
  const jobResponsibilitiesChange = (event, index) => {
    const responsibilities = [...jobResponsibilities];
    responsibilities[index].value = event.target.value;
    setResponsibilities(responsibilities);
  };

  const jobNameIsTouched = (event) => {
    setJobName((prev) => ({ ...prev, isTouched: true }));
  };
  const jobTitleIsTouched = (event) => {
    setJobTitle((prev) => ({ ...prev, isTouched: true }));
  };
  const jobSalaryIsTouched = (event) => {
    setJobSalary((prev) => ({ ...prev, isTouched: true }));
  };
  const jobReasonIsTouched = (index) => {
    setJobReason((prev) => setTouchedState(prev, index));
  };
  const jobDescriptionIsTouched = (event) => {
    setJobDescription((prev) => ({ ...prev, isTouched: true }));
  };
  const jobAboutTeamIsTouched = (event) => {
    setJobAboutOurTeam((prev) => ({ ...prev, isTouched: true }));
  };
  const jobMustSkillIsTouched = (index) => {
    setMustSkills((prev) => setTouchedState(prev, index));
  };
  const jobNiceSkillIsTouched = (index) => {
    setJobNiceSkills((prev) => setTouchedState(prev, index));
  };
  const jobWhyLoveIsTouched = (event) => {
    setWhyYouWillLove((prev) => ({ ...prev, isTouched: true }));
  };
  const jobBenefitIsTouched = (index) => {
    setJobBenefits((prev) => setTouchedState(prev, index));
  };
  const jobResponsibilitiesIsTouched = (index) => {
    setResponsibilities((prev) => setTouchedState(prev, index));
  };

  const setTouchedState = (prevValues, index) => {
    const newValue = [...prevValues];
    newValue[index].isTouched = true;
    return newValue;
  };

  const jobAddNameIsValid = isEmpty(jobAddName.value) && jobAddName.isTouched;
  const jobTitleIsValid = isEmpty(jobTitle.value) && jobTitle.isTouched;
  const jobSalaryIsValid = isEmpty(jobSalary.value) && jobSalary.isTouched;
  const jobReasonIsValid = (topReason) =>
    topReason.isTouched && isEmpty(topReason.value);
  const jobDescriptionIsValid =
    isEmpty(jobDescription.value) && jobDescription.isTouched;
  const jobAboutTeamIsValid =
    isEmpty(jobAboutOurTeam.value) && jobAboutOurTeam.isTouched;
  const jobMustSkillIsValid = (mustHaveSkill) =>
    mustHaveSkill.isTouched && isEmpty(mustHaveSkill.value);
  const jobNiceSkillIsValid = (niceHaveSkill) =>
    niceHaveSkill.isTouched && isEmpty(niceHaveSkill.value);
  const jobWhyLoveIsValid =
    isEmpty(jobWhyYouWillLove.value) && jobWhyYouWillLove.isTouched;
  const jobBenefitIsValid = (benefit) =>
    benefit.isTouched && isEmpty(benefit.value);
  const jobResponsibilitiesIsValid = (responsibility) =>
    responsibility.isTouched && isEmpty(responsibility.value);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const addBenefitHandler = () => {
    setJobBenefits((prev) => [...prev, { ...defaultField }]);
  };

  const addMustHaveSkillHandler = () => {
    setMustSkills((prev) => [...prev, { ...defaultField }]);
  };

  const addNiceHaveSkillHandler = () => {
    setJobNiceSkills((prev) => [...prev, { ...defaultField }]);
  };

  const addResponsibilityHandler = () => {
    setResponsibilities((prev) => [...prev, { ...defaultField }]);
  };

  const addTopReasonHandler = () => {
    setJobReason((prev) => [...prev, { ...defaultField }]);
  };

  const removeBenefitHandler = (index) => {
    setJobBenefits((prev) => {
      const newValue = [...prev];
      newValue.splice(index, 1);
      return newValue;
    });
  };

  const removeMustHaveSkillHandler = (index) => {
    setMustSkills((prev) => removeElement(prev, index));
  };

  const removeNiceHaveSkillHandler = (index) => {
    setJobNiceSkills((prev) => removeElement(prev, index));
  };

  const removeResponsibilityHandler = (index) => {
    setResponsibilities((prev) => removeElement(prev, index));
  };

  const removeTopReasonHandler = (index) => {
    setJobReason((prev) => removeElement(prev, index));
  };

  const removeElement = (prevValues, index) => {
    const newValue = [...prevValues];
    newValue.splice(index, 1);
    return newValue;
  };

  const formik = useFormik({
    initialValues: {
      name: jobAddName,
      title: jobTitle,
      salary: jobSalary,
      topReasons: jobReason,
      description: jobDescription,
      aboutOurTeam: jobAboutOurTeam,
      responsibilities: jobResponsibilities,
      mustHaveSkills: jobMustSkills,
      niceToHaveSkills: jobNiceSkills,
      whyYouWillLove: jobWhyYouWillLove,
      benefits: jobBenefits,
      semesterIds: jobMajorIds,
      majorIds: jobMajorIds,
    },

    onSubmit: async () => {
      try {
        if (!overallValidField) {
          return;
        }
        const response = await axiosPrivate.post('/jobs/create-job', {
          name: jobAddName.value,
          title: jobTitle.value,
          salary: jobSalary.value,
          topReasons: jobReason.map((x) => x.value),
          description: jobDescription.value,
          descriptionItems: ['string'],
          aboutOurTeam: jobAboutOurTeam.value,
          responsibilities: jobResponsibilities.map((x) => x.value),
          mustHaveSkills: jobMustSkills.map((x) => x.value),
          niceToHaveSkills: jobNiceSkills.map((x) => x.value),
          whyYouWillLove: jobWhyYouWillLove.value,
          benefits: jobBenefits.map((x) => x.value),
          semesterIds: [jobSemesterIds],
          majorIds: [jobMajorIds],
          companyId: localStorage.getItem('id'),
        });
        console.log('a: ', response.data.data);
      } catch (error) {
        console.error(error);
        if (!error?.response) {
          alert('No Server Response');
        } else {
          alert('Create Failed. Your input information is invalid!');
        }
      }
    },
  });
  const overallValidField =
    !isEmpty(jobAddName.value) &&
    !isEmpty(jobTitle.value) &&
    !isEmpty(jobSalary.value) &&
    jobReason.every((topReason) => !isEmpty(topReason.value)) &&
    !isEmpty(jobDescription.value) &&
    !isEmpty(jobAboutOurTeam.value) &&
    jobResponsibilities.every(
      (responsiblity) => !isEmpty(responsiblity.value)
    ) &&
    jobMustSkills.every((mustSkill) => !isEmpty(mustSkill.value)) &&
    jobNiceSkills.every((niceSkill) => !isEmpty(niceSkill.value)) &&
    !isEmpty(jobWhyYouWillLove.value) &&
    jobBenefits.every((benefit) => !isEmpty(benefit.value)) &&
    jobResponsibilitiesIsValid;

  const { handleSubmit } = formik;
  return (
    <Box>
      <Grid
        container
        direction='row'
        role='presentation'
        item
        justifyContent='flex-end'
        lg={12}
      >
        <Breadcrumbs aria-label='breadcrumb'>
          <Link
            to='/company/dashboard/profile'
            style={{ color: '#637381', textDecoration: 'none' }}
          >
            Company
          </Link>

          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color='text.primary'
          >
            New Job
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid
        item
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          mt: 5,
          p: 3,
          pb: 8,
          ml: 20,
        }}
        style={{ width: '80%' }}
        autoComplete='off'
        lg={12}
        md={12}
        xs={12}
      >
        <Box
          sx={{
            pl: 5,
          }}
        >
          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color='text.primary'
            variant='h4'
          >
            New Job
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
              <Grid
                item
                sx={{
                  pt: 2,
                }}
              >
                <TextField
                  required
                  id='name'
                  label='Name'
                  style={{ width: '45%' }}
                  error={jobAddNameIsValid}
                  helperText={jobAddNameIsValid ? 'Name is required' : ''}
                  value={jobAddName.value}
                  onChange={jobNameChange}
                  onBlur={jobNameIsTouched}
                />
                <TextField
                  required
                  id='title'
                  label='Title'
                  style={{ width: '45%' }}
                  error={jobTitleIsValid}
                  helperText={jobTitleIsValid ? 'Title is required' : ''}
                  value={jobTitle.value}
                  onChange={jobTitleChange}
                  onBlur={jobTitleIsTouched}
                />

                <TextField
                  required
                  id='salary'
                  label='Salary'
                  //   multiline
                  //   rows={8}
                  style={{ width: '91.5%' }}
                  error={jobSalaryIsValid}
                  helperText={jobSalaryIsValid ? 'Salary is required' : ''}
                  onChange={jobSalaryChange}
                  value={jobSalary.value}
                  onBlur={jobSalaryIsTouched}
                />
                <Typography variant='h5' mt={2}>
                  Top Reasons
                </Typography>
                {jobReason.map((topReason, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item md={10}>
                      <TextField
                        key={index}
                        required
                        id='outlined-company-name-input'
                        label='Top Reason'
                        style={{ width: '100%' }}
                        error={jobReasonIsValid(topReason)}
                        helperText={
                          jobReasonIsValid(topReason)
                            ? 'Top reason is required'
                            : ''
                        }
                        value={topReason.value}
                        onChange={(e) => jobReasonChange(e, index)}
                        multiline
                        rows={5}
                        onBlur={(e) => jobReasonIsTouched(index)}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <IconButton
                        key={index}
                        disabled={jobReason.length === 1}
                        aria-label='delete'
                        size='large'
                        onClick={(e) => removeTopReasonHandler(index)}
                        color='primary'
                        style={{ width: '50%' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant='outlined'
                  onClick={addTopReasonHandler}
                  style={{ width: '91.5%', marginLeft: '0.5%' }}
                >
                  Add top reason
                </Button>

                <TextField
                  required
                  id='outlined-company-email-input'
                  label='Description'
                  style={{ width: '91.5%' }}
                  error={jobDescriptionIsValid}
                  helperText={
                    jobDescriptionIsValid ? 'Description is required' : ''
                  }
                  value={jobDescription.value}
                  onChange={jobDescriptionChange}
                  multiline
                  rows={5}
                  onBlur={jobDescriptionIsTouched}
                />

                <TextField
                  required
                  id='outlined-company-address-input'
                  label='About Our Team'
                  style={{ width: '91.5%' }}
                  error={jobAboutTeamIsValid}
                  helperText={jobAboutTeamIsValid ? 'About is required' : ''}
                  onChange={jobAboutTeamChange}
                  value={jobAboutOurTeam.value}
                  multiline
                  rows={5}
                  onBlur={jobAboutTeamIsTouched}
                />
                <Typography variant='h5' mt={2}>
                  Responsibilities
                </Typography>
                {jobResponsibilities.map((responsibility, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item md={10}>
                      <TextField
                        key={index}
                        required
                        id='outlined-company-address-input'
                        label='Responsibilities'
                        style={{ width: '100%' }}
                        error={jobResponsibilitiesIsValid(responsibility)}
                        helperText={
                          jobResponsibilitiesIsValid(responsibility)
                            ? 'Responsibilities is required'
                            : ''
                        }
                        onChange={(e) => jobResponsibilitiesChange(e, index)}
                        value={responsibility.value}
                        multiline
                        rows={5}
                        onBlur={(e) => jobResponsibilitiesIsTouched(index)}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <IconButton
                        key={index}
                        disabled={jobResponsibilities.length === 1}
                        aria-label='delete'
                        size='large'
                        onClick={(e) => removeResponsibilityHandler(index)}
                        color='primary'
                        style={{ width: '50%' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant='outlined'
                  onClick={addResponsibilityHandler}
                  style={{ width: '91.5%', marginLeft: '0.5%' }}
                >
                  Add responsibility
                </Button>
                <Typography variant='h5' mt={2}>
                  Must have Skills
                </Typography>
                {jobMustSkills.map((mustHaveSkill, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item md={10}>
                      <TextField
                        key={index}
                        required
                        id='outlined-company-address-input'
                        label='Must have Skills'
                        style={{ width: '100%' }}
                        error={jobMustSkillIsValid(mustHaveSkill)}
                        helperText={
                          jobMustSkillIsValid(mustHaveSkill)
                            ? 'Skills is required'
                            : ''
                        }
                        onChange={(e) => jobMustSkillChange(e, index)}
                        value={mustHaveSkill.value}
                        multiline
                        rows={5}
                        onBlur={(e) => jobMustSkillIsTouched(index)}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <IconButton
                        key={index}
                        disabled={jobMustSkills.length === 1}
                        aria-label='delete'
                        size='large'
                        onClick={(e) => removeMustHaveSkillHandler(index)}
                        color='primary'
                        style={{ width: '50%' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant='outlined'
                  onClick={addMustHaveSkillHandler}
                  style={{ width: '91.5%', marginLeft: '0.5%' }}
                >
                  Add must have skill
                </Button>
                <Typography variant='h5' mt={2}>
                  Nice to have Skills
                </Typography>
                {jobNiceSkills.map((niceHaveSkill, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item md={10}>
                      <TextField
                        key={index}
                        required
                        id='outlined-company-address-input'
                        label='Nice to have Skills'
                        style={{ width: '100%' }}
                        error={jobNiceSkillIsValid(niceHaveSkill)}
                        helperText={
                          jobNiceSkillIsValid(niceHaveSkill)
                            ? 'Skill is required'
                            : ''
                        }
                        onChange={(e) => jobNiceSkillChange(e, index)}
                        value={niceHaveSkill.value}
                        multiline
                        rows={5}
                        onBlur={(e) => jobNiceSkillIsTouched(index)}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <IconButton
                        key={index}
                        disabled={jobNiceSkills.length === 1}
                        aria-label='delete'
                        size='large'
                        onClick={(e) => removeNiceHaveSkillHandler(index)}
                        color='primary'
                        style={{ width: '50%' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant='outlined'
                  onClick={addNiceHaveSkillHandler}
                  style={{ width: '91.5%', marginLeft: '0.5%' }}
                >
                  Add Nice to have skill
                </Button>
                <TextField
                  required
                  id='outlined-company-address-input'
                  label='Why you will love'
                  style={{ width: '91.5%' }}
                  error={jobWhyLoveIsValid}
                  helperText={jobWhyLoveIsValid ? 'Reason is required' : ''}
                  onChange={jobWhyLoveChange}
                  value={jobWhyYouWillLove.value}
                  multiline
                  rows={5}
                  onBlur={jobWhyLoveIsTouched}
                />
                <Typography variant='h5' mt={2}>
                  Benefits
                </Typography>
                {jobBenefits.map((benefit, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item md={10}>
                      <TextField
                        key={index}
                        required
                        id='outlined-company-address-input'
                        label='Benefit'
                        style={{ width: '100%' }}
                        error={jobBenefitIsValid(benefit)}
                        helperText={
                          jobBenefitIsValid(benefit)
                            ? 'Benefits is required'
                            : ''
                        }
                        onChange={(e) => jobBenefitChange(e, index)}
                        value={benefit.value}
                        multiline
                        rows={5}
                        onBlur={(e) => jobBenefitIsTouched(index)}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <IconButton
                        key={index}
                        disabled={jobBenefits.length === 1}
                        aria-label='delete'
                        size='large'
                        onClick={(e) => removeBenefitHandler(index)}
                        color='primary'
                        style={{ width: '50%' }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant='outlined'
                  onClick={addBenefitHandler}
                  style={{ width: '91.5%', marginLeft: '0.5%' }}
                >
                  Add Benefit
                </Button>

                <FormControl sx={{ width: '45%', ml: 1, mt: 3 }}>
                  <InputLabel id='smester-select'>Semester</InputLabel>
                  <Select
                    labelId='smester-select'
                    id='smester-select'
                    value={jobSemesterIds}
                    label='Semester'
                    onChange={jobSemesterChange}
                  >
                    <MenuItem value={1}>Spring 2021</MenuItem>
                    <MenuItem value={2}>Summer 2021</MenuItem>
                    <MenuItem value={3}>Fall 2021</MenuItem>
                    <MenuItem value={4}>Spring 2022</MenuItem>
                    <MenuItem value={5}>Summer 2022</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ width: '45%', ml: 1, mt: 3 }}>
                  <InputLabel id='major-select'>Major</InputLabel>
                  <Select
                    labelId='major-select'
                    id='major-select'
                    label='Major'
                    value={jobMajorIds}
                    onChange={jobMajorIDChange}
                  >
                    <MenuItem value={1}>Software Engineering</MenuItem>
                    <MenuItem value={2}>Digital Art Design</MenuItem>
                    <MenuItem value={3}>Information Security</MenuItem>
                    <MenuItem value={4}>Information System</MenuItem>
                    <MenuItem value={5}>Artificial Intelligence</MenuItem>
                    <MenuItem value={6}>IoT</MenuItem>
                    <MenuItem value={7}>Business Administration</MenuItem>
                    <MenuItem value={8}>International Business</MenuItem>
                    <MenuItem value={9}>Digital Marketing</MenuItem>
                    <MenuItem value={10}>
                      Tourism and Holiday Service Administration
                    </MenuItem>
                    <MenuItem value={11}>
                      Multifunctional Communication Administration
                    </MenuItem>
                    <MenuItem value={12}>Hotel Management</MenuItem>
                    <MenuItem value={13}>Japanese</MenuItem>
                    <MenuItem value={14}>Korean</MenuItem>
                  </Select>
                </FormControl>

                <Grid
                  item
                  justifyContent='flex-end'
                  alignItems='flex-end'
                  container
                >
                  <Button
                    disabled={!overallValidField}
                    variant='contained'
                    color='primary'
                    sx={{
                      mt: 4,
                      mr: 10,
                    }}
                    type='submit'
                    onClick={handleClick}
                  >
                    Submit
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <AlertSucess
                      onClose={handleClose}
                      severity={overallValidField ? 'success' : 'error'}
                      sx={{ width: '100%' }}
                    >
                      Job's Information added{' '}
                      {overallValidField ? 'success' : 'error'}!
                    </AlertSucess>
                  </Snackbar>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Box>
      </Grid>
    </Box>
  );
}
