import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WikiContentRenderer } from '../components/wiki/WikiContentRenderer';
import { WikiInfobox } from '../components/wiki/WikiInfobox';
import { WikiSidebar } from '../components/wiki/WikiSidebar';
import { useWikiViewModel } from '../viewModels/useWikiViewModel';
import './WikiArticleView.scss';

export const WikiArticleView: FC = () => {
  const { campaignID = 'bttf', articleSlug } = useParams<{
    campaignID?: string;
    articleSlug?: string;
  }>();

  const {
    campaign,
    categories,
    articles,
    currentArticle,
    selectedCategory,
    searchQuery,
    searchResults,
    isLoading,
    errorMessage,
    setSearchQuery,
    setSelectedCategory,
    resolveCanonicalSlug,
  } = useWikiViewModel(campaignID, articleSlug);

  return (
    <div className="wiki-view-container">
      <WikiSidebar
        campaign={campaign}
        categories={categories}
        articles={articles}
        activeSlug={currentArticle?.ArticleSlug || articleSlug}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
      />

      <main className="wiki-main-viewport">
        <nav className="wiki-breadcrumbs" aria-label="Migas de pan">
          <Link to="/campaigns">Campañas</Link>
          <span className="separator">/</span>
          <Link to={`/wiki/${campaignID}`}>{campaign?.CampaignTitle || campaignID}</Link>
          {currentArticle && (
            <>
              <span className="separator">/</span>
              <span className="current-crumb">{currentArticle.ArticleTitle}</span>
            </>
          )}
        </nav>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Cargando expediente…</span>
            </div>
            <p className="mt-2 text-muted font-monospace">Accediendo a los archivos de la wiki…</p>
          </div>
        ) : currentArticle ? (
          <>
            <header className="article-header">
              <div className="article-badge">
                <i className="fas fa-microchip" />
                <span>Expediente de Lore // Base de Datos Central</span>
              </div>
              <h1 className="article-title">{currentArticle.ArticleTitle}</h1>
              <div className="article-meta-bar">
                <span>
                  <i className="fas fa-barcode" />
                  {currentArticle.ArticleID}
                </span>
                <span>
                  <i className="far fa-calendar-alt" />
                  Última revisión: {currentArticle.LastModified || 'Reciente'}
                </span>
                <span>
                  <i className="fas fa-folder-open" />
                  {currentArticle.ArticleCategories.join(', ') || 'General'}
                </span>
              </div>
            </header>

            <div className="article-body-layout">
              {currentArticle.ArticleInfobox && (
                <WikiInfobox infobox={currentArticle.ArticleInfobox} />
              )}

              <WikiContentRenderer
                content={currentArticle.ArticleContent}
                campaignID={campaignID}
                categories={currentArticle.ArticleCategories}
                resolveSlug={resolveCanonicalSlug}
              />
            </div>
          </>
        ) : (
          <div className="article-not-found">
            <i className="fas fa-folder-minus" />
            <h3>Expediente No Encontrado</h3>
            <p>{errorMessage || 'El artículo solicitado no existe o fue desclasificado.'}</p>
            <Link to={`/wiki/${campaignID}`} className="btn btn-outline-info font-monospace mt-2">
              Ver artículo principal de la campaña
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
