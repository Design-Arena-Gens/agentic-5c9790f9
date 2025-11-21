'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { defaultFormData } from '@/lib/defaults';
import { generateNotice } from '@/lib/generateNotice';
import {
  ACCESS_ACCUEIL_OPTIONS,
  ACCESS_CIRC_H_OPTIONS,
  ACCESS_CIRC_V_OPTIONS,
  ACCESS_CONFORT_OPTIONS,
  ACCESS_SANITAIRES_OPTIONS,
  ACCESS_SIGNALETIQUE_OPTIONS,
  ACCESS_STATIONNEMENT_OPTIONS,
  ERP_CATEGORIES,
  ERP_TYPES,
  FIRE_COMPARTIMENTATION_OPTIONS,
  FIRE_DETECTION_OPTIONS,
  FIRE_DESENFUMAGE_OPTIONS,
  FIRE_EVACUATION_OPTIONS,
  FIRE_SUPPRESSION_OPTIONS
} from '@/lib/options';
import { AccessibilityArrayField, FireArrayField, NoticeFormData } from '@/lib/types';

const RISK_OPTIONS = [
  { value: 'faible', label: 'Faible' },
  { value: 'modere', label: 'Modéré' },
  { value: 'eleve', label: 'Élevé' }
];

const SSI_TYPE_OPTIONS = [
  { value: '', label: 'À préciser' },
  { value: 'A', label: 'Type A' },
  { value: 'B', label: 'Type B' },
  { value: 'C', label: 'Type C' },
  { value: 'D', label: 'Type D' },
  { value: 'E', label: 'Type E' }
];

const SSI_CATEGORY_OPTIONS = [
  { value: '', label: 'À préciser' },
  { value: '1', label: 'Catégorie 1' },
  { value: '2', label: 'Catégorie 2' },
  { value: '3', label: 'Catégorie 3' },
  { value: '4', label: 'Catégorie 4' }
];

type StatusState = { type: 'success' | 'error'; message: string } | null;

const groupClass = 'grid form-grid';

export default function Page() {
  const [formData, setFormData] = useState<NoticeFormData>(defaultFormData);
  const [status, setStatus] = useState<StatusState>(null);

  const notice = useMemo(() => generateNotice(formData), [formData]);

  const updateGeneral = useCallback(
    (field: keyof NoticeFormData['general']) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value } = event.target;
        setFormData((prev) => ({
          ...prev,
          general: {
            ...prev.general,
            [field]: value
          }
        }));
      },
    []
  );

  const updateFire = useCallback(
    (field: keyof NoticeFormData['fire']) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value } = event.target;
        setFormData((prev) => ({
          ...prev,
          fire: {
            ...prev.fire,
            [field]: value
          }
        }));
      },
    []
  );

  const updateAccessibility = useCallback(
    (field: keyof NoticeFormData['accessibility']) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value } = event.target;
        setFormData((prev) => ({
          ...prev,
          accessibility: {
            ...prev.accessibility,
            [field]: value
          }
        }));
      },
    []
  );

  const toggleFireArray = useCallback((field: FireArrayField, value: string) => {
    setFormData((prev) => {
      const alreadyChecked = prev.fire[field].includes(value);
      const updated = alreadyChecked ? prev.fire[field].filter((item) => item !== value) : [...prev.fire[field], value];
      return {
        ...prev,
        fire: {
          ...prev.fire,
          [field]: updated
        }
      };
    });
  }, []);

  const toggleAccessibilityArray = useCallback((field: AccessibilityArrayField, value: string) => {
    setFormData((prev) => {
      const alreadyChecked = prev.accessibility[field].includes(value);
      const updated = alreadyChecked
        ? prev.accessibility[field].filter((item) => item !== value)
        : [...prev.accessibility[field], value];
      return {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          [field]: updated
        }
      };
    });
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(notice);
      setStatus({ type: 'success', message: 'Notice copiée dans le presse-papiers.' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: "Impossible de copier automatiquement. Copiez manuellement le contenu." });
    }
  }, [notice]);

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([notice], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.general.projectName.replace(/\s+/g, '_').toLowerCase()}_notice_incendie_accessibilite.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'Notice téléchargée au format .txt.' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: "Le téléchargement a échoué. Réessayez ou copiez le texte." });
    }
  }, [notice, formData.general.projectName]);

  const handleReset = useCallback(() => {
    setFormData(defaultFormData);
    setStatus(null);
  }, []);

  return (
    <div className="page-wrapper">
      <main className="main">
        <div className="container grid">
          <section className="card">
            <h1 className="title">Assistant Notices Sécurité & Accessibilité</h1>
            <p className="subtitle">
              Renseignez les caractéristiques de votre projet pour produire automatiquement une notice de sécurité
              incendie et d&apos;accessibilité conforme aux attentes d&apos;un bureau de contrôle.
            </p>

            <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
              <div>
                <h2 className="section-title">Informations générales</h2>
                <div className={groupClass}>
                  <div className="field">
                    <label htmlFor="projectName">Nom du projet</label>
                    <input
                      id="projectName"
                      value={formData.general.projectName}
                      onChange={updateGeneral('projectName')}
                      placeholder="Intitulé officiel du dossier"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="maitreOuvrage">Maître d&apos;ouvrage</label>
                    <input
                      id="maitreOuvrage"
                      value={formData.general.maitreOuvrage}
                      onChange={updateGeneral('maitreOuvrage')}
                      placeholder="Personne morale ou physique responsable"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="adresse">Adresse de l&apos;opération</label>
                    <input
                      id="adresse"
                      value={formData.general.adresse}
                      onChange={updateGeneral('adresse')}
                      placeholder="Adresse postale complète"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="architecte">Architecte / MOE</label>
                    <input
                      id="architecte"
                      value={formData.general.architecte}
                      onChange={updateGeneral('architecte')}
                      placeholder="Nom de l'agence ou du responsable"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="dateRedaction">Date de rédaction</label>
                    <input
                      id="dateRedaction"
                      type="date"
                      value={formData.general.dateRedaction}
                      onChange={updateGeneral('dateRedaction')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="programme">Programme et description</label>
                    <textarea
                      id="programme"
                      rows={4}
                      value={formData.general.programme}
                      onChange={updateGeneral('programme')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="erpType">Type d&apos;ERP</label>
                    <select id="erpType" value={formData.general.erpType} onChange={updateGeneral('erpType')}>
                      {ERP_TYPES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="erpCategory">Catégorie d&apos;ERP</label>
                    <select
                      id="erpCategory"
                      value={formData.general.erpCategory}
                      onChange={updateGeneral('erpCategory')}
                    >
                      {ERP_CATEGORIES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="surfaceTotale">Surface totale</label>
                    <input
                      id="surfaceTotale"
                      value={formData.general.surfaceTotale}
                      onChange={updateGeneral('surfaceTotale')}
                      placeholder="Ex : 2 450 m²"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="hauteurBatiment">Hauteur du bâtiment</label>
                    <input
                      id="hauteurBatiment"
                      value={formData.general.hauteurBatiment}
                      onChange={updateGeneral('hauteurBatiment')}
                      placeholder="Ex : 18 m"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="effectifTotal">Effectif pris en compte</label>
                    <input
                      id="effectifTotal"
                      value={formData.general.effectifTotal}
                      onChange={updateGeneral('effectifTotal')}
                      placeholder="Effectif public + personnel"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="environnement">Environnement urbain</label>
                    <textarea
                      id="environnement"
                      rows={3}
                      value={formData.general.environnement}
                      onChange={updateGeneral('environnement')}
                      placeholder="Implantation, mitoyenneté, accès, contexte urbain..."
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="observations">Observations complémentaires</label>
                    <textarea
                      id="observations"
                      rows={3}
                      value={formData.general.observations ?? ''}
                      onChange={updateGeneral('observations')}
                      placeholder="Contraintes particulières, phasage, coordination..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="section-title">Sécurité incendie</h2>
                <div className={groupClass}>
                  <div className="field">
                    <label htmlFor="niveauRisque">Niveau de risque retenu</label>
                    <select id="niveauRisque" value={formData.fire.niveauRisque} onChange={updateFire('niveauRisque')}>
                      {RISK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ssiType">Type de SSI</label>
                    <select id="ssiType" value={formData.fire.ssiType} onChange={updateFire('ssiType')}>
                      {SSI_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ssiCategorie">Catégorie SSI</label>
                    <select id="ssiCategorie" value={formData.fire.ssiCategorie} onChange={updateFire('ssiCategorie')}>
                      {SSI_CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="reactionMateriaux">Réaction au feu des matériaux</label>
                    <textarea
                      id="reactionMateriaux"
                      rows={3}
                      value={formData.fire.reactionMateriaux}
                      onChange={updateFire('reactionMateriaux')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="resistanceStructure">Résistance au feu de la structure</label>
                    <textarea
                      id="resistanceStructure"
                      rows={3}
                      value={formData.fire.resistanceStructure}
                      onChange={updateFire('resistanceStructure')}
                    />
                  </div>

                  <fieldset className="field">
                    <label>Moyens d&apos;évacuation</label>
                    <div className="pill-group">
                      {FIRE_EVACUATION_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.fire.evacuation.includes(option.value)}
                            onChange={() => toggleFireArray('evacuation', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Moyens d&apos;extinction</label>
                    <div className="pill-group">
                      {FIRE_SUPPRESSION_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.fire.suppression.includes(option.value)}
                            onChange={() => toggleFireArray('suppression', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Détection et alarme</label>
                    <div className="pill-group">
                      {FIRE_DETECTION_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.fire.detection.includes(option.value)}
                            onChange={() => toggleFireArray('detection', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Compartimentage</label>
                    <div className="pill-group">
                      {FIRE_COMPARTIMENTATION_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.fire.compartimentage.includes(option.value)}
                            onChange={() => toggleFireArray('compartimentage', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Désenfumage</label>
                    <div className="pill-group">
                      {FIRE_DESENFUMAGE_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.fire.desenfumage.includes(option.value)}
                            onChange={() => toggleFireArray('desenfumage', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="field">
                    <label htmlFor="accesSecours">Accès des services de secours</label>
                    <textarea
                      id="accesSecours"
                      rows={2}
                      value={formData.fire.accesSecours}
                      onChange={updateFire('accesSecours')}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="organisationSecours">Organisation interne des secours</label>
                    <textarea
                      id="organisationSecours"
                      rows={2}
                      value={formData.fire.organisationSecours}
                      onChange={updateFire('organisationSecours')}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="mesuresComplementaires">Mesures complémentaires</label>
                    <textarea
                      id="mesuresComplementaires"
                      rows={2}
                      value={formData.fire.mesuresComplementaires}
                      onChange={updateFire('mesuresComplementaires')}
                      placeholder="Adaptations spécifiques, consignations, scénarios SSI..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="section-title">Accessibilité</h2>
                <div className={groupClass}>
                  <fieldset className="field">
                    <label>Accueil du public</label>
                    <div className="pill-group">
                      {ACCESS_ACCUEIL_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.accueil.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('accueil', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Cheminements horizontaux</label>
                    <div className="pill-group">
                      {ACCESS_CIRC_H_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.circulationHorizontale.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('circulationHorizontale', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Cheminements verticaux</label>
                    <div className="pill-group">
                      {ACCESS_CIRC_V_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.circulationVerticale.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('circulationVerticale', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Sanitaires</label>
                    <div className="pill-group">
                      {ACCESS_SANITAIRES_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.sanitaires.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('sanitaires', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Stationnement</label>
                    <div className="pill-group">
                      {ACCESS_STATIONNEMENT_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.stationnement.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('stationnement', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Signalétique</label>
                    <div className="pill-group">
                      {ACCESS_SIGNALETIQUE_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.signaletique.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('signaletique', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="field">
                    <label>Confort d&apos;usage</label>
                    <div className="pill-group">
                      {ACCESS_CONFORT_OPTIONS.map((option) => (
                        <label key={option.value} className="pill">
                          <input
                            type="checkbox"
                            checked={formData.accessibility.confort.includes(option.value)}
                            onChange={() => toggleAccessibilityArray('confort', option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="field">
                    <label htmlFor="gestion">Gestion et suivi</label>
                    <textarea
                      id="gestion"
                      rows={3}
                      value={formData.accessibility.gestion}
                      onChange={updateAccessibility('gestion')}
                      placeholder="Registre public d'accessibilité, formation personnel..."
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="amenagementsSpecifiques">Aménagements spécifiques</label>
                    <textarea
                      id="amenagementsSpecifiques"
                      rows={3}
                      value={formData.accessibility.amenagementsSpecifiques}
                      onChange={updateAccessibility('amenagementsSpecifiques')}
                    />
                  </div>
                </div>
              </div>

              <div className="actions">
                <button type="button" className="primary" onClick={handleCopy}>
                  Copier la notice
                </button>
                <button type="button" className="secondary" onClick={handleDownload}>
                  Télécharger (.txt)
                </button>
                <button type="button" onClick={handleReset}>
                  Réinitialiser
                </button>
              </div>
            </form>
          </section>

          <aside className="preview">
            <span className="badge">Notice générée</span>
            <h3>Prévisualisation en temps réel</h3>
            <pre>{notice}</pre>
            <p className="helper-text">
              Le contenu est conforme à la structure attendue par la commission de sécurité et le bureau de contrôle.
              Vous pouvez compléter les annexes graphiques séparément (plans, schémas SSI, tableaux de surfaces).
            </p>
            {status && (
              <div className={`status ${status.type}`}>
                <strong>{status.type === 'success' ? 'Succès' : 'Attention'}</strong>
                <span>{status.message}</span>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
