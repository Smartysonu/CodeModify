package ext.cummins.part.listener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import ext.cummins.listner.AbstractCumminsEvents;
import ext.cummins.part.CumminsPartResource;
import ext.cummins.utils.CumminsUtils;
import wt.doc.WTDocument;
import wt.epm.EPMDocument;
import wt.part.WTPart;
import wt.util.WTException;
import wt.util.WTMessage;
import wt.vc.wip.WorkInProgressHelper;

public class CumminsPartDocCADReviseListener extends AbstractCumminsEvents {
	
	/** The Constant ENGINEERING. */
	public static final String ENGINEERING = "Engineering";
	
	/** The Constant ZZ Revision. */
	public static final String ZZ_Revision = "ZZ";
	
	/** The Constant CLASSNAME. */
	private static final String CLASSNAME = CumminsPartDocCADReviseListener.class.getName();

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);
	
	/** The Constant RESOURCE. */
	private static final String RESOURCE = CumminsPartResource.class.getName();

	@Override
	public void apply(Object obj) throws WTException {
		
		if (obj != null && obj instanceof WTPart) {
			WTPart part = (WTPart) obj;
			boolean doOperation = WorkInProgressHelper.isCheckedOut(part) 
					|| (WorkInProgressHelper.isWorkingCopy(part)) ? false : true;
			boolean isValidationApplicable = CumminsUtils.getOrganizationPreference(part.getOrganizationName(),
					"PART_DOC_CAD_REVISE_VALIDATION");
			if (doOperation && isValidationApplicable) {
				String partSeriesName = part.getMaster().getSeries();
				LOGGER.debug("Series : " + partSeriesName);
				String partVersion = part.getVersionIdentifier().getValue();
				String partNumber = part.getNumber();
				LOGGER.debug("partNumber : " + partNumber + ", partVersion :" + partVersion);
				if((partSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries")
						|| partSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries_Legacy")) 
						&& partVersion.equalsIgnoreCase(ZZ_Revision) && part.getViewName().equalsIgnoreCase(ENGINEERING)){
					throw new WTException(new WTMessage(RESOURCE,
							CumminsPartResource.ERR_ZZ_Revision,new Object[] {}));
				}
			}
		}
		
		else if (obj != null && obj instanceof WTDocument) {
			WTDocument wtDoc = (WTDocument) obj;
			boolean doOperation = WorkInProgressHelper.isCheckedOut(wtDoc) 
					|| (WorkInProgressHelper.isWorkingCopy(wtDoc)) ? false : true;
			boolean isValidationApplicable = CumminsUtils.getOrganizationPreference(wtDoc.getOrganizationName(),
					"PART_DOC_CAD_REVISE_VALIDATION");
			if (doOperation && isValidationApplicable) {
				String docSeriesName = wtDoc.getMaster().getSeries();
				LOGGER.debug("Series : " + docSeriesName);
				String docVersion = wtDoc.getVersionIdentifier().getValue();
				String docNumber = wtDoc.getNumber();
				LOGGER.debug("docNumber : " + docNumber + ", docVersion :" + docVersion);
				if((docSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries")
						|| docSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries_Legacy")) 
						&& docVersion.equalsIgnoreCase(ZZ_Revision)){
					throw new WTException(new WTMessage(RESOURCE,
							CumminsPartResource.ERR_ZZ_Revision,new Object[] {}));
				}
			}
		}
		else if (obj != null && obj instanceof EPMDocument) {
			EPMDocument epmDoc = (EPMDocument) obj;
			boolean doOperation = WorkInProgressHelper.isCheckedOut(epmDoc) 
					|| (WorkInProgressHelper.isWorkingCopy(epmDoc)) ? false : true;
			boolean isValidationApplicable = CumminsUtils.getOrganizationPreference(epmDoc.getOrganizationName(),
					"PART_DOC_CAD_REVISE_VALIDATION");
			if (doOperation && isValidationApplicable) {
				String epmDocSeriesName = epmDoc.getMaster().getSeries();
				LOGGER.debug("Series : " + epmDocSeriesName);
				String epmDocVersion = epmDoc.getVersionIdentifier().getValue();
				String epmDocNumber = epmDoc.getNumber();
				LOGGER.debug("epmdocNumber : " + epmDocNumber + ", epmdocVersion :" + epmDocVersion);
				if((epmDocSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries")
						|| epmDocSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries_Legacy")) 
						&& epmDocVersion.equalsIgnoreCase(ZZ_Revision)){
					throw new WTException(new WTMessage(RESOURCE,
							CumminsPartResource.ERR_ZZ_Revision,new Object[] {}));
				}
			}
		}
	}

}

