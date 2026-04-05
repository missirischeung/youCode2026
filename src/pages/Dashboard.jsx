import { useState } from 'react'
import { Container, Modal } from 'react-bootstrap'
import PreviewCard from '../components/PreviewCard'
import OpportunityCard from '../components/OpportunityCard'
import opportunities from '../data/opportunities'
import './Dashboard.css'

function Dashboard({ onCommit = () => {}, committedIds = [], searchQuery = '' }) {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null)

    const handleCommit = (details) => {
        onCommit(details)
        setSelectedOpportunity(null)
    }

    const filteredOpportunities = opportunities.filter((opportunity) => {
        const query = searchQuery.toLowerCase()

        return (
            opportunity.title?.toLowerCase().includes(query) ||
            opportunity.organization?.toLowerCase().includes(query) ||
            opportunity.location?.toLowerCase().includes(query) ||
            opportunity.skills?.some(skill =>
                skill.toLowerCase().includes(query)
            )
        )
    })

    return (
        <div className="dashboard-page">
            <Container className="py-5">
                <h1 className="dashboard-title">Opportunities for You</h1>

                <p className="dashboard-subtitle">
                    Explore supportive ways to build skills, contribute, and grow confidence.
                </p>

                <div className="opportunity-list">
                    {filteredOpportunities.length === 0 ? (
                        <p style={{ color: '#64748b' }}>
                            No opportunities match your search.
                        </p>
                    ) : (
                        filteredOpportunities.map((opportunity) => (
                            <PreviewCard
                                key={opportunity.id}
                                {...opportunity}
                                onClick={() => setSelectedOpportunity(opportunity)}
                            />
                        ))
                    )}
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
