import React, {useEffect} from 'react';
import {Button, Form, FormSelect, Modal} from "react-bootstrap";
import {showCreatedIssueAlert} from "../../../functions/alert";

export default function ModalCreateIssue({openModal, createIssueData, setOpenModal}) {
    if (!openModal || (0 === createIssueData.length)) {
        return;
    }

    const [assignee, setAssignee] = React.useState();
    const [people, setPeople] = React.useState([]);
    const [project, setProject] = React.useState(createIssueData['projects'][0]['id']);
    const [summary, setSummary] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/issues', {
            body: JSON.stringify({
                assignee: `/api/users/${assignee}`,
                project: `/api/projects/${project}`,
                reporter: '/api/users/1',
                summary: summary,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
            .then(response => response.json())
            .then((issue) => {
                setOpenModal(false);

                showCreatedIssueAlert(issue.id);

                document.dispatchEvent(new CustomEvent('onCreateIssue', {
                    detail: issue
                }));
            });
    }

    const updateAssigneeValue = (e) => {
        console.log(e.target.value);
        setAssignee(e.target.value);
    }

    const updateProjectValue = (e) => {
        setProject(e.target.value);
    }

    useEffect(() => {
        fetch(`/api/projects/${project}/people`)
            .then(response => response.json())
            .then(json => {
                setAssignee(json['people'][0]['id']);
                setPeople(json['people']);
            });
    }, []);

    return (
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>
                <h5>Create issue</h5>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="mb-4 block">
                            <Form.Label className="required" htmlFor="project">Project</Form.Label>
                            <FormSelect id="project" value={project} onChange={updateProjectValue}>
                                {createIssueData.projects?.map((project) => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <div className="mb-4 block">
                            <Form.Label className="required" htmlFor="issueType">Issue Type</Form.Label>
                            <FormSelect id="issueType">
                                {createIssueData.types?.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <div className="mb-4 block">
                            <Form.Label className="required" htmlFor="status">Status</Form.Label>
                            <FormSelect id="status">
                                {createIssueData.statuses?.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <Form.Group className="mb-4 block">
                            <Form.Label className="required" htmlFor="summary">Summary</Form.Label>
                            <Form.Control id="summary" onChange={(e) => setSummary(e.target.value)} required />
                        </Form.Group>

                        <div className="mb-4 block">
                            <Form.Label htmlFor="assignee">Assignee</Form.Label>
                            <FormSelect id="assignee" onChange={updateAssigneeValue} value={assignee}>
                                {people.map((person) => (
                                    <option key={person.id} value={person.id}>{person.firstName} {person.lastName}</option>
                                ))}
                            </FormSelect>
                        </div>

                        <div className="mb-4 block">
                            <Form.Label className="required" htmlFor="reporter">Reporter</Form.Label>
                            <FormSelect id="reporter">
                                <option>Pentiminax</option>
                            </FormSelect>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">Create</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}