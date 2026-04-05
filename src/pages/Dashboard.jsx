import { useState } from 'react'
import { Container, Modal } from 'react-bootstrap'
import PreviewCard from '../components/PreviewCard'
import OpportunityCard from '../components/OpportunityCard'
import opportunities from '../data/opportunities'
import './Dashboard.css'

function Dashboard({ onCommit, committedIds = [] }) {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null)

    function handleCommit(details) {
        onCommit?.(details)
        setSelectedOpportunity(null)
    }

    return (
        <div className="dashboard-page">
            <Container className="py-5">
                <h1 className="dashboard-title">Opportunities for You</h1>

                <p className="dashboard-subtitle">
                    Explore supportive ways to build skills, contribute, and grow confidence.
                </p>

                <div className="opportunity-list">
                    {opportunities.map((opportunity) => (
                        <PreviewCard
                            key={opportunity.id}
                            {...opportunity}
                            onClick={() => setSelectedOpportunity(opportunity)}
                        />
                    ))}
                </div>
            </Container>

            <Modal
                show={!!selectedOpportunity}
                onHide={() => setSelectedOpportunity(null)}
                centered
                size="lg"
                dialogClassName="opportunity-modal"
            >
                <Modal.Body className="opportunity-modal-body p-0">
                    {selectedOpportunity && (
                        <OpportunityCard
                            {...selectedOpportunity}
                            onCommit={handleCommit}
                            isCommitted={committedIds.includes(selectedOpportunity.id)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Dashboard
