const { useState, useEffect } = React;

// Initial mockup data
const defaultWorkouts = [
    { id: 1, title: 'Upper Body Power', type: 'Strength', duration: 45, date: new Date().toISOString() },
    { id: 2, title: 'Morning Run', type: 'Cardio', duration: 30, date: new Date(Date.now() - 86400000).toISOString() }
];

function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [workouts, setWorkouts] = useState(() => {
        const saved = localStorage.getItem('aura_workouts');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return defaultWorkouts; }
        }
        return defaultWorkouts;
    });

    // Save to local storage whenever workouts change
    useEffect(() => {
        localStorage.setItem('aura_workouts', JSON.stringify(workouts));
    }, [workouts]);

    const addWorkout = (workout) => {
        setWorkouts([{ ...workout, id: Date.now(), date: new Date().toISOString() }, ...workouts]);
        setCurrentView('dashboard');
    };

    const deleteWorkout = (id) => {
        setWorkouts(workouts.filter(w => w.id !== id));
    };

    // Derived Statistics
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((acc, curr) => acc + parseInt(curr.duration || 0), 0);
    const thisWeek = workouts.filter(w => {
        const wDate = new Date(w.date);
        const now = new Date();
        const diffTime = Math.abs(now - wDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7;
    }).length;

    return (
        <div className="animate-fade-in">
            <header className="glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem' }}>
                <div className="logo">
                     <i className="fa-solid fa-bolt"></i> Aura Fitness
                </div>
                <nav>
                    <button 
                        className={currentView === 'dashboard' ? 'active' : ''} 
                        onClick={() => setCurrentView('dashboard')}>
                        Dashboard
                    </button>
                    <button 
                        className={currentView === 'add' ? 'active' : ''} 
                        onClick={() => setCurrentView('add')}>
                        + New Workout
                    </button>
                    <button 
                        className={currentView === 'history' ? 'active' : ''} 
                        onClick={() => setCurrentView('history')}>
                        History
                    </button>
                </nav>
            </header>

            <main>
                {currentView === 'dashboard' && (
                    <Dashboard 
                        totalWorkouts={totalWorkouts} 
                        totalMinutes={totalMinutes} 
                        thisWeek={thisWeek} 
                        recentWorkouts={workouts.slice(0, 3)}
                        onDelete={deleteWorkout}
                    />
                )}
                {currentView === 'add' && (
                    <AddWorkoutForm onAdd={addWorkout} />
                )}
                {currentView === 'history' && (
                    <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />
                )}
            </main>
        </div>
    );
}

function Dashboard({ totalWorkouts, totalMinutes, thisWeek, recentWorkouts, onDelete }) {
    return (
        <div className="animate-fade-in">
            <div className="dashboard-grid">
                <div className="glass-panel stat-card">
                    <div className="stat-icon primary">
                        <i className="fa-solid fa-fire"></i>
                    </div>
                    <div className="stat-details">
                        <h3>Total Workouts</h3>
                        <p>{totalWorkouts}</p>
                    </div>
                </div>
                
                <div className="glass-panel stat-card">
                    <div className="stat-icon secondary">
                        <i className="fa-solid fa-stopwatch"></i>
                    </div>
                    <div className="stat-details">
                        <h3>Active Minutes</h3>
                        <p>{totalMinutes}</p>
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-icon success">
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div className="stat-details">
                        <h3>This Week</h3>
                        <p>{thisWeek}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--accent-secondary)' }}></i> Recent Activity
                </h2>
                
                {recentWorkouts.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-dumbbell"></i>
                        <p>No workouts logged yet. Time to get sweating!</p>
                    </div>
                ) : (
                    <div className="workout-list">
                        {recentWorkouts.map(w => (
                            <WorkoutItem key={w.id} workout={w} onDelete={onDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AddWorkoutForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Strength');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !duration) return;
        
        onAdd({
            title,
            type,
            duration: parseInt(duration)
        });
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Log New Workout</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Workout Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Leg Day, Morning Jog..." 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Workout Type</label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="Strength">Strength Training</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Flexibility">Yoga / Flexibility</option>
                        <option value="Sports">Sports</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Duration (Minutes)</label>
                    <input 
                        type="number" 
                        placeholder="45" 
                        min="1"
                        value={duration} 
                        onChange={e => setDuration(e.target.value)}
                        required 
                    />
                </div>
                
                <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Save Workout
                </button>
            </form>
        </div>
    );
}

function WorkoutHistory({ workouts, onDelete }) {
    return (
        <div className="glass-panel animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Complete History</h2>
            
            {workouts.length === 0 ? (
                <div className="empty-state">
                    <i className="fa-solid fa-clipboard-list"></i>
                    <p>Your history is empty.</p>
                </div>
            ) : (
                <div className="workout-list">
                    {workouts.map(w => (
                        <WorkoutItem key={w.id} workout={w} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}

function WorkoutItem({ workout, onDelete }) {
    const dateStr = new Date(workout.date).toLocaleDateString(undefined, { 
        weekday: 'short', month: 'short', day: 'numeric' 
    });

    const getIcon = (type) => {
        switch(type) {
            case 'Strength': return 'fa-dumbbell';
            case 'Cardio': return 'fa-person-running';
            case 'Flexibility': return 'fa-person-praying';
            default: return 'fa-heart-pulse';
        }
    };

    return (
        <div className="workout-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`stat-icon ${workout.type === 'Cardio' ? 'secondary' : 'primary'}`} style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                    <i className={`fa-solid ${getIcon(workout.type)}`}></i>
                </div>
                <div className="workout-info">
                    <h4>{workout.title}</h4>
                    <p>{dateStr}</p>
                </div>
            </div>
            
            <div className="workout-meta">
                <div className="meta-badge">
                    <i className="fa-regular fa-clock"></i> {workout.duration} min
                </div>
                <button className="delete-btn" onClick={() => onDelete(workout.id)} title="Delete Workout">
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
