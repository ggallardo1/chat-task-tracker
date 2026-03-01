import { useState } from "react";

// CSS-in-JS for clean isolation without Tailwind
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cardExpanded: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase'
  },
  detailBox: {
    marginTop: '12px',
    padding: '10px',
    backgroundColor: '#f8fafc',
    borderLeft: '3px solid #3b82f6',
    fontSize: '13px',
    color: '#475569'
  }
};

export const TaskCard = ({ task }: { task: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDone = task.status === "COMPLETED";

  return (
    <div 
      style={{ ...styles.card, ...(isExpanded ? styles.cardExpanded : {}) }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={styles.header}>
        <strong style={{ color: isExpanded ? '#2563eb' : '#1e293b' }}>{task.title}</strong>
        <span style={{ 
          ...styles.badge, 
          backgroundColor: isDone ? '#dcfce7' : '#dbeafe',
          color: isDone ? '#15803d' : '#1d4ed8' 
        }}>
          {task.status}
        </span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            OPERATIONAL DETAILS (R3)
          </p>
          {task.details && task.details.length > 0 ? (
            task.details.map((d: any, i: number) => (
              <div key={i} style={styles.detailBox}>{d.content || d}</div>
            ))
          ) : (
            <em style={{ fontSize: '12px', color: '#94a3b8' }}>No details attached.</em>
          )}
        </div>
      )}
    </div>
  );
};
