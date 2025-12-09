
import React, { useState, useEffect } from 'react';
import { ViewMode, Workshop } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ItemDetail } from './pages/ItemDetail';
import { AxisConfig } from './pages/AxisConfig';
import { Timeline } from './pages/Timeline';
import { Gantt } from './pages/Gantt';
import { ResourcesCost } from './pages/ResourcesCost';
import { People } from './pages/People';
import { Matrix } from './pages/Matrix';
import { Heatmap } from './pages/Heatmap';
import { InputModal } from './components/InputModal';
import { HelpModal } from './components/HelpModal';
import { ExportModal } from './components/ExportModal'; // New Import
import { api } from './services/api';
import { INITIAL_WORKSHOPS } from './services/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false); // New State
  
  // Workshop State
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [currentWorkshopId, setCurrentWorkshopId] = useState<string>(INITIAL_WORKSHOPS[0].id);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialValue: string;
    type: 'create' | 'rename';
    targetId?: string;
  }>({ isOpen: false, title: '', initialValue: '', type: 'create' });

  useEffect(() => {
    api.getWorkshops().then(ws => {
       setWorkshops(ws);
       if (ws.length > 0 && !currentWorkshopId) {
         setCurrentWorkshopId(ws[0].id);
       }
    });
  }, []);

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
  };

  const handleCloseEdit = () => {
    setEditingItemId(null);
  };
  
  const handleSwitchWorkshop = (id: string) => {
    setCurrentWorkshopId(id);
    setEditingItemId(null);
    setCurrentView('list');
  };
  
  const handleCreateWorkshop = () => {
    setModalConfig({
      isOpen: true,
      title: "Create New Workshop",
      initialValue: "",
      type: 'create'
    });
  };

  const handleRenameWorkshop = (id: string) => {
    const ws = workshops.find(w => w.id === id);
    if (!ws) return;
    setModalConfig({
      isOpen: true,
      title: "Rename Workshop",
      initialValue: ws.name,
      type: 'rename',
      targetId: id
    });
  };

  const handleModalSubmit = async (value: string) => {
    if (!value.trim()) return;

    if (modalConfig.type === 'create') {
      const newWs = await api.createWorkshop(value);
      setWorkshops([...workshops, newWs]);
      setCurrentWorkshopId(newWs.id);
      setCurrentView('list');
    } else if (modalConfig.type === 'rename' && modalConfig.targetId) {
       const updated = await api.updateWorkshop(modalConfig.targetId, { name: value });
       setWorkshops(prev => prev.map(w => w.id === modalConfig.targetId ? updated : w));
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleCreateNewFromDetail = async () => {
     // Create a new blank item and immediately switch editing to it
     const newItem = await api.createItem(currentWorkshopId, { title: "" });
     setEditingItemId(newItem.id);
  };

  const renderContent = () => {
    if (editingItemId) {
      return (
        <ItemDetail 
          itemId={editingItemId} 
          onClose={handleCloseEdit} 
          onCreateNew={handleCreateNewFromDetail} 
        />
      );
    }

    switch (currentView) {
      case 'list':
        return <Dashboard onEditItem={handleEditItem} workshopId={currentWorkshopId} />;
      case 'timeline':
        return <Timeline workshopId={currentWorkshopId} onEditItem={handleEditItem} />;
      case 'gantt':
        return <Gantt workshopId={currentWorkshopId} onEditItem={handleEditItem} />;
      case 'resources':
        return <ResourcesCost workshopId={currentWorkshopId} onEditItem={handleEditItem} />;
      case 'people':
        return <People workshopId={currentWorkshopId} onEditItem={handleEditItem} />;
      case 'heatmap':
        return <Heatmap workshopId={currentWorkshopId} />;
      case 'settings':
        return <AxisConfig />;
      default:
        return <Dashboard onEditItem={handleEditItem} workshopId={currentWorkshopId} />;
    }
  };

  return (
    <>
      <Layout 
         currentView={currentView} 
         onNavigate={(v) => { setCurrentView(v); setEditingItemId(null); }}
         workshops={workshops}
         currentWorkshopId={currentWorkshopId}
         onSwitchWorkshop={handleSwitchWorkshop}
         onCreateWorkshop={handleCreateWorkshop}
         onRenameWorkshop={handleRenameWorkshop}
         onHelp={() => setIsHelpOpen(true)}
         onExport={() => setIsExportOpen(true)} // Pass new handler
      >
        {renderContent()}
      </Layout>

      <InputModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        initialValue={modalConfig.initialValue}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSubmit={handleModalSubmit}
      />

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        workshopId={currentWorkshopId}
      />
    </>
  );
};

export default App;
