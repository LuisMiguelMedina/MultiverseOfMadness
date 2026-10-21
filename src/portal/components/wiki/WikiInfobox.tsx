import { FC } from 'react';
import { WikiInfoboxBase } from '../../models/Wiki/WikiModels';
import './WikiInfobox.scss';

export interface WikiInfoboxProps {
  infobox: WikiInfoboxBase;
}

export const WikiInfobox: FC<WikiInfoboxProps> = ({ infobox }) => {
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'CHARACTER':
        return 'Expediente de Personaje';
      case 'FACTION':
        return 'Dossier de Facción';
      case 'LOCATION':
        return 'Registro Geográfico / Dimensión';
      default:
        return 'Ficha Técnica';
    }
  };

  return (
    <aside className="wiki-infobox" aria-label="Ficha de información">
      <div className="infobox-header">
        <span className="infobox-type">{getTypeLabel(infobox.InfoboxType)}</span>
        <h3 className="infobox-title">{infobox.Title}</h3>
      </div>

      {infobox.ImageUrl && (
        <div className="infobox-media">
          <div className="token-frame">
            <img src={infobox.ImageUrl} alt={infobox.Title} />
          </div>
          {infobox.ImageCaption && <span className="media-caption">{infobox.ImageCaption}</span>}
        </div>
      )}

      {infobox.Properties.length > 0 && (
        <table className="infobox-table">
          <tbody>
            {infobox.Properties.map((prop, idx) => (
              <tr key={`${prop.Key}-${idx}`}>
                <th scope="row">{prop.Key}</th>
                <td>{prop.Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  );
};
