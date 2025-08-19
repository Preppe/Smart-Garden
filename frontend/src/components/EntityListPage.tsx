import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EntityListPageProps<T> {
  items: T[];
  loading: boolean;
  error?: Error | null;
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyTitle: string;
  emptyDescription: string;
  createButtonText: string;
  onCreateNew: () => void;
  renderCard: (item: T) => React.ReactNode;
  showStats?: boolean;
  renderStats?: () => React.ReactNode;
  containerClassName?: string;
  gridClassName?: string;
}

function EntityListPage<T>({
  items,
  loading,
  error,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  createButtonText,
  onCreateNew,
  renderCard,
  showStats = false,
  renderStats,
  containerClassName = "max-w-7xl mx-auto px-4 py-6",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
}: EntityListPageProps<T>) {
  if (loading) {
    return (
      <div className={containerClassName}>
        {showStats && renderStats && (
          <div className="mb-6">
            {renderStats()}
          </div>
        )}
        
        <div className={gridClassName}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClassName}>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-700">Errore nel caricamento: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          {createButtonText}
        </Button>
      </div>

      {/* Optional Stats */}
      {showStats && renderStats && (
        <div className="mb-6">
          {renderStats()}
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card className="border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <EmptyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyTitle}</h3>
            <p className="text-gray-600 mb-6">{emptyDescription}</p>
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              {createButtonText}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className={gridClassName}>
            {items.map((item, index) => (
              <div key={index}>
                {renderCard(item)}
              </div>
            ))}
          </div>
          
          {/* Results count */}
          {items.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-600">
              Visualizzando {items.length} elementi
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EntityListPage;