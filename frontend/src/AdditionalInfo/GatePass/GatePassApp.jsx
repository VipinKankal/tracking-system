import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
 
import CarRentalIcon from '@mui/icons-material/CarRental';
import FlakyRoundedIcon from '@mui/icons-material/FlakyRounded';
 
const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow: auto;
 `;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;
const Subtitle = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
  color: #4b5563;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2.2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 900px;
    margin: 0 auto;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
`;

const getIconStyles = (type) => {
  const styles = {
    primary: { background: '#e0f2fe', color: '#0284c7' },
    danger: { background: '#fee2e2', color: '#dc2626' },
    success: { background: '#dcfce7', color: '#16a34a' },
    warning: { background: '#fef3c7', color: '#d97706' },
    CarAllotment: { background: '#e1f5e6', color: '#0f0569' },
    CarAllotmentByCustomer: { background: '#ebe6ed', color: '#09913d' },
    CarAllotmentBOOKING: { background: '#f4f2f5', color: '#0b070d' },
   };
  return styles[type] || styles.primary;
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 1.5rem;
  background: ${props => getIconStyles(props.iconType).background};
  color: ${props => getIconStyles(props.iconType).color};
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const CardNumber = styled.div`
  font-size: 2.5rem;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const CardStatus = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;



function GatepassApp() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ 
    Approval: 0, 
    Rejected: 0, 
    Pending: 0,
    totalInterested: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGatepassData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getCustomerDetailsWithStatuses');
        const data = await response.json();
        
        if (data.success) {
          setCounts({
            Approval: data.data.counts.gatePass?.Approval || 0,
            Rejected: data.data.counts.gatePass?.Rejected || 0,
            Pending: data.data.counts.gatePass?.Pending || 0,
            totalInterested: data.data.counts.gatePass?.totalInterested || 0
          });
        } else {
          throw new Error('Failed to fetch gatepass data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGatepassData();
  }, []);

  const statusCards = [
    {
      id: 'Approved',
      title: 'Gatepass Approved',
      count: counts.Approval,
      status: 'Approved',
      icon: FlakyRoundedIcon,
      iconType: 'Approved',
      path: '/account-Management/gatepass-approved',
    },
    {
      id: 'Rejected',
      title: 'Gatepass Rejected',
      count: counts.Rejected,
      status: 'Rejected',
      icon: FlakyRoundedIcon,
      iconType: 'Rejected',
      path: '/account-Management/gatepass-rejected',
    },
    {
      id: 'pending',
      title: 'Gatepass Pending',
      count: counts.Pending,
      status: 'Pending Approval',
      icon: CarRentalIcon,
      iconType: 'pending',
      path: '/account-Management/car-pending-for-gatepass',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <Container>Loading gatepass data...</Container>;
  }

  if (error) {
    return (
      <Container>
        <div style={{ color: 'red', textAlign: 'center' }}>
          Error: {error}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Gatepass Status Overview</Title>
       <Grid>
        {statusCards.map((card) => (
          <Card 
            key={card.id}
            onClick={() => handleCardClick(card.path)}
          >
            <CardContent>
              <IconWrapper iconType={card.iconType}>
                <card.icon sx={{ fontSize: 32 }} />
              </IconWrapper>
              <CardInfo>
                <CardTitle>{card.title}</CardTitle>
                <CardNumber>{card.count}</CardNumber>
                <CardStatus>Status: {card.status}</CardStatus>
              </CardInfo>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default GatepassApp;


