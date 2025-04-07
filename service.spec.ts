/***
 * ----------------------------------------------------------------------------
 * Copyright (c) Tata Consultancy Services (TCS) or Cummins Inc.
 * All Rights Reserved.
 *
 * Copying or reproduction without any prior written approval is prohibited.
 *-----------------------------------------------------------------------------
 */

package ext.cummins.part.mvc.builders;

import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.ICON;
import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.INFO_ACTION;
import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.STATE;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.logging.log4j.*;

import com.ptc.jca.mvc.components.JcaComponentParams;
import com.ptc.mvc.components.AbstractComponentBuilder;
import com.ptc.mvc.components.ColumnConfig;
import com.ptc.mvc.components.ComponentBuilder;
import com.ptc.mvc.components.ComponentConfig;
import com.ptc.mvc.components.ComponentConfigFactory;
import com.ptc.mvc.components.ComponentParams;
import com.ptc.mvc.components.TableConfig;
import com.ptc.netmarkets.util.beans.NmCommandBean;
import com.ptc.netmarkets.util.beans.NmHelperBean;

import ext.cummins.part.CumminsPartConstantIF;
import ext.cummins.utils.CumminsUtils;
import wt.associativity.WTAssociativityHelper;
import wt.doc.WTDocument;
import wt.doc.WTDocumentMaster;
import wt.epm.EPMDocument;
import wt.fc.Persistable;
import wt.fc.QueryResult;
import wt.fc.WTObject;

import wt.part.WTPart;
import wt.part.WTPartHelper;
import wt.util.WTException;
import wt.vc.config.LatestConfigSpec;
/**
*
* <b>Class:</b> CumminsEquivalentPartsTableBuilder.java <br>
* <br>
* <b> Description:</b> Table Builder for Part and its references and describe by documents. <br>
* <br>
*
* @author Tata Consultancy Services (TCS) <br>
* <br>
*/
@ComponentBuilder("ext.cummins.part.mvc.builders.CumminsEquivalentPartsTableBuilder")
public class CumminsEquivalentPartsTableBuilder extends AbstractComponentBuilder {

	/** The Constant CLASSNAME. */
	private static final String CLASSNAME = CumminsEquivalentPartsTableBuilder.class.getName();

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);

	/** The type. */
	private static String type = "Type";

	/** The number. */
	private static String number = "Number";

	/** The name. */
	private static String name = "Name";

	/** The state. */
	private static String state = "State";

	private static String versionViewDisplayName = "Version";

	private static String context = "Context";
	
	private static String content = "Content";

	/**
	 * This method is used to configure MVC TableComponent and sets all the
	 * table properties and define the Column and Row properties and Data sets.
	 *
	 * @param params
	 *            the params
	 * @return ComponentConfig
	 * @throws WTException
	 *             the WT exception
	 */

	@Override
	public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {

		LOGGER.debug("Enter >> CumminsPartAddTableBuilder");
		// ResourceBundle plantRB = ResourceBundle.getBundle(RESOURCE);
		ComponentConfigFactory factory = getComponentConfigFactory();

		TableConfig table = factory.newTableConfig();
		// table.setLabel(label);
		table.setId("ext.cummins.part.mvc.builders.CumminsEquivalentPartsTableBuilder");
		table.setSelectable(false);
		table.setShowCount(true);
		table.setActionModel("");

		// add columns
		// number

		// type
		ColumnConfig col1 = factory.newColumnConfig(ICON, true);
		col1.setLabel(type);
		table.addComponent(col1);

		ColumnConfig col2 = factory.newColumnConfig(number, false);
		col2.setLabel(number);
		table.addComponent(col2);

		table.addComponent(factory.newColumnConfig(INFO_ACTION, true));

		// name
		ColumnConfig col3 = factory.newColumnConfig(name, true);
		col3.setLabel(name);
		table.addComponent(col3);

		// version
		ColumnConfig col4 = factory.newColumnConfig("versionInfo.identifier.versionId", true);
		col4.setLabel(versionViewDisplayName);
		table.addComponent(col4);
		
		//content
		ColumnConfig col7 = factory.newColumnConfig("formatIcon", true);
		col7.setLabel(content);
		table.addComponent(col7);

		// context
		ColumnConfig col6 = factory.newColumnConfig("containerReference", true);
		col6.setLabel(context);
		table.addComponent(col6);

		// state
		ColumnConfig col5 = factory.newColumnConfig(STATE, true);
		col5.setLabel(state);
		table.addComponent(col5);
		
		

		LOGGER.debug("End >> CumminsEquivalentPartsTableBuilder");
		return table;
	}

	/**
	 * This method is used to build Component Data for MVC Table and populate
	 * table DataSets based on query specification.
	 *
	 * @param config
	 *            the config
	 * @param paramComponentParams
	 *            the param component params
	 * @return Object
	 * @throws WTException
	 *             will throw WT Exception.
	 * @throws IOException
	 *             Signals that an I/O exception has occurred.
	 */

	@SuppressWarnings("unchecked")
	@Override
	public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {

		NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
		NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

		Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
		WTPart wtpart = null;
		ArrayList<WTObject> listobj = new ArrayList<WTObject>();
		QueryResult result = new QueryResult();
		if (requestObj != null) {
			if ((requestObj instanceof WTPart)) {
				wtpart = (WTPart) requestObj;
				if (!wtpart.getViewName().equalsIgnoreCase(CumminsPartConstantIF.ENGINEERING)) {

					// upstream part
					result = WTAssociativityHelper.service.findUpstreamEquivalent(wtpart);
					LatestConfigSpec configSpec = new LatestConfigSpec();
					result = configSpec.process(result);
					while (result.hasMoreElements()) {
						WTPart upstreamwtpart = (WTPart) result.nextElement();
						listobj.add(upstreamwtpart);
						
						// reference doc
						QueryResult referenceresult = WTPartHelper.service.getReferencesWTDocumentMasters(upstreamwtpart);

						while (referenceresult.hasMoreElements()) {
							WTDocument refdoc = (WTDocument) CumminsUtils.getLatestObject((WTDocumentMaster) referenceresult.nextElement());
							listobj.add(refdoc);
						}
						
						// described doc
						QueryResult docresult = WTPartHelper.service.getDescribedByDocuments(upstreamwtpart);
                       
						while (docresult.hasMoreElements()) {
						WTObject docobj = (WTObject) docresult.nextElement();
						if(!(docobj instanceof EPMDocument)) {
							listobj.add(docobj);
						}
						}

					}
				}

			}
		}
		return listobj;
	}
}
